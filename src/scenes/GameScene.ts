import Phaser, { Input } from 'phaser';
import { Player } from '../Player';
import { UIGameState } from '../gamestate/UIGameState';
import { Skeleton } from '../npcs/Skeleton';
import { King } from '../npcs/King';
import { SecondKing } from '../npcs/SecondKing';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Farmer } from '../npcs/Farmer';
import { Claude } from '../npcs/Claude';
import { WorldRender } from './WorldRender';
import { AnimatedSprite } from '../classes/AnimatedSprite';
import { SkeletonManager } from '../classes/SkeletonManager';
import { AudioManager } from '../classes/AudioManager';
import { CursorManager } from '../classes/CursorManager';
import { ProgressionManager } from '../classes/ProgressionManager';

import { EntityFactory } from '../classes/EntityFactor';
import { InputHandler } from '../classes/Input';

export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState!: UIGameState;
  public skeletons!: Skeleton[];
  private skeletonManager!: SkeletonManager;
  public buildingsLayer?: Phaser.Tilemaps.TilemapLayer;
  public king!: King;
  public secondKing!: SecondKing
  public villagers!: Villager[];
  public farmer!: Farmer;
  public claude!: Claude;
  public TILE_SIZE = 16;
  public skeletonNumber = 12
  public skeletonSpawnDelay = 4000
  private collisionLayers!: Phaser.Tilemaps.TilemapLayer[];
  private playedHordeAudio = false;
  public mealsSound!: Phaser.Sound.BaseSound;
  private hordeSound!: Phaser.Sound.BaseSound;
  private CursorManager!: CursorManager;

  private inputHandler: InputHandler;

  


  constructor() {
    super('GameScene');


  }

  preload() {
    WorldRender.load_assets(this);
    AudioManager.loadAudio(this);
    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });
    EntityFactory.preloadAll(this);


  }

  create() {
    //Characters

    this.inputHandler = new InputHandler(this);

    this.player = new Player(this, 36 * this.TILE_SIZE, 19 * this.TILE_SIZE, this.inputHandler)//720, 528); // 35 18
    EntityFactory.renderNPCs(this);
    this.skeletonManager = new SkeletonManager(this);

    //GameState
    const { villagerConfigs, foods, titles, farmerConfig }: { villagerConfigs: Array<VillagerConfig>, foods, titles, farmerConfig} = WorldRender.loadConfigsAndDialogues();
    this.uiGameState = new UIGameState(foods, titles, EntityFactory.getVillagersLength())

    
    //Audio
    AudioManager.createSounds(this);
    //Cursor
    this.CursorManager = new CursorManager(this);

    //World Render

    WorldRender.create(this);    
    this.buildingsLayer = WorldRender.buildingsLayer;
    this.collisionLayers = WorldRender.collisionLayers;

    const mapWidth = WorldRender.map.widthInPixels;
    const mapHeight = WorldRender.map.heightInPixels;


    //CAMERAS
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(4)
    this.cameras.main.startFollow(this.player.getSprite(), true, 1, 1);

    //COLLISION LAYER
    this.collisionLayers.forEach(layer => {
      this.physics.add.collider(this.player.getSprite(), layer);
    })

    //UI STUFF 
    this.scene.launch('ui', {
      playerHealth: this.player.getHealth(),
      titles: this.uiGameState.getTitlesList(),
      foods: this.uiGameState.getFoodCountsList(),
    });
    this.scene.bringToTop('ui');
    this.events.emit("dialogue:show", "The journey of a thousand Turkey Sandwiches 🥪 begins with a single boar.")
  }


  update() {

    this.player.update();

    if (this.CursorManager.checkToShowCursor()) {
      this.CursorManager.showCursor();
      this.CursorManager.resetMouseIdleTimer();
    }

    const playerX = this.player.getX()
    const playerY = this.player.getY()

    // logs current coordinates; don't remove, comment out if not needed
    // console.log(Math.floor(playerX), Math.floor(playerY))

    const now = this.time.now


    if (playerX > 80 * this.TILE_SIZE) {
      const playerSprite = this.player.getSprite();
      (playerSprite.body as Phaser.Physics.Arcade.Body).setGravityY(50000);
      this.time.delayedCall(500, () => {
        this.scene.stop('ui');
        this.scene.start('GameOverScene', {
          score: this.uiGameState.getScore(),
          win: false
        });
      });
    }

    if (this.uiGameState.allowedToDeliverBurger() && !this.playedHordeAudio) {
      this.playedHordeAudio = true;
      AudioManager.playSound(this, this.hordeSound);
    }



    this.skeletonManager.checkEndGameAndUpdateSkeletonNumber();
    this.skeletonManager.createSkeletonAtRandomArea();
    this.skeletonManager.getSkeletons().forEach(v => v.updateFollow(playerX, playerY, 50))

    // attack player
    this.skeletonManager.getSkeletons().forEach(s => {
      if (s.triggerAttack(playerX, playerY)) {
        this.player.damageReceived()
      }
    })

    // handle player's death
    if (this.player.isDead()) {
      console.log('dead')
      this.scene.stop('ui');
      this.scene.start('GameOverScene', { score: this.uiGameState.getScore(), win: false });
    }

    // Proximity checks handled by base NPC class; death trigger is skeleton-specific
    this.skeletonManager.getSkeletons().forEach(skeleton => {
      skeleton.checkPlayerInteraction(playerX, playerY);
    })
    this.farmer.checkPlayerInteraction(playerX, playerY);
    this.king.checkPlayerInteraction(playerX, playerY);
    this.claude.checkPlayerInteraction(playerX, playerY);
    this.secondKing.checkPlayerInteraction(playerX, playerY);
    this.villagers.forEach(villager => {
      villager.checkPlayerInteraction(playerX, playerY);
    });

    if (this.player.isAttacking()) {
      this.skeletonManager.getSkeletons().forEach(skeleton => {
        if (skeleton.isPlayerNear()) {
          skeleton.applyKnockback(this.player.getX(), this.player.getY());
          skeleton.triggerDeath();
        }
      })
    }

    if (this.player.justPressedFoodKey()) {
      // console.log("farmer near: ", this.farmer.isPlayerNear());
      // console.log("king near: ", this.king.isPlayerNear());
      // console.log("villager near: ", this.villager.isPlayerNear());
      if (this.farmer.isPlayerNear()) this.farmer.triggerPickUp()
      if (this.king.isPlayerNear()) this.king.triggerDelivery()
      this.villagers.forEach(villager => {
        if (villager.isPlayerNear()) villager.triggerDelivery(ProgressionManager.getInstance(this));
      });
    }
  }  
 
}
