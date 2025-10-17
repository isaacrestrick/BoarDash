import Phaser, { Tilemaps } from 'phaser';
import { Player } from '../Player';
import { UIGameState } from '../gamestate/UIGameState';
import { Skeleton } from '../npcs/Skeleton';
import { King } from '../npcs/King';
import { SecondKing } from '../npcs/SecondKing';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Farmer } from '../npcs/Farmer';
import { Claude } from '../npcs/Claude';
import { MageSkeleton } from '../npcs/MageSkeleton';
import { WorldRender } from './WorldRender';
import { AnimatedSprite } from '../classes/AnimatedSprite';
import type { AnimationConfig } from '../classes/AnimatedSprite';
import { SkeletonManager } from '../classes/SkeletonManager';
import { AudioManager } from '../classes/AudioManager';
import { CursorManager } from '../classes/CursorManager';

import { ProgressionManager } from '../classes/ProgressionManager';

export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState!: UIGameState;
  public skeletons!: Skeleton[];
  private skeletonManager!: SkeletonManager;
  public buildingsLayer?: Phaser.Tilemaps.TilemapLayer;
  private king!: King;
  private secondKing!: SecondKing
  private villagers!: Villager[];
  private farmer!: Farmer;
  private claude!: Claude;
  private readonly TILE_SIZE = 16;
  public skeletonNumber = 12
  public skeletonSpawnDelay = 4000

  private collisionLayers!: Phaser.Tilemaps.TilemapLayer[];

  private playedHordeAudio = false;
  public mealsSound!: Phaser.Sound.BaseSound;
  private hordeSound!: Phaser.Sound.BaseSound;


  private CursorManager!: CursorManager;

  


  constructor() {
    super('GameScene');
  }

  preload() {

    WorldRender.load_assets(this);


    this.load.image('ui-heart', 'Heart.png');


    AudioManager.loadAudio(this);


    Object.values(WorldRender.ANIMATION_CONFIGS).forEach(config => {
      AnimatedSprite.preloadAssets(this, config)
    })

    Object.values(WorldRender.ANIMATION_WITHOUT_X_Y).forEach(config => {
      AnimatedSprite.preloadAssets(this, config);
    })
  

    
    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });

    let objects = [Skeleton, King, SecondKing, Villager, Farmer, MageSkeleton];

    objects.forEach((object) => {
      object.getRequiredAssets().forEach(asset => {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      });
    })

    Claude.getRequiredAssets().forEach(asset => {
      this.load.image(asset.key, asset.path);
    });
  }

  create() {

    AudioManager.createSounds(this);

    this.CursorManager = new CursorManager(this);


    ////////////CURSOR//////////////

    


    ////////////////WorldRender

    WorldRender.create(this);    
    this.buildingsLayer = WorldRender.buildingsLayer;
    this.collisionLayers = WorldRender.collisionLayers;

    const mapWidth = WorldRender.map.widthInPixels;
    const mapHeight = WorldRender.map.heightInPixels;


    //VISUALS


    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // this.cameras.main.setZoom(2);
    this.cameras.main.setZoom(4)


    // const viewportWidth = this.cameras.main.width / this.cameras.main.zoom;
    // const viewportHeight = this.cameras.main.height / this.cameras.main.zoom;
    // this.cameras.main.scrollX = mapWidth - viewportWidth;
    // this.cameras.main.scrollY = 0;

    
    //KEYBOARD INPUT
    const cursors = this.input.keyboard!.createCursorKeys();

    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    };

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);    



    this.player = new Player(this, 36 * this.TILE_SIZE, 19 * this.TILE_SIZE)//720, 528); // 35 18


    //initialized sound there;
    



    this.collisionLayers.forEach(layer => {
      this.physics.add.collider(this.player.getSprite(), layer);
    })
    // Debug: Show collision boxes (remove once working)
    // const graphics = this.add.graphics();
    // graphics.lineStyle(2, 0x00ff00, 1);
    // buildingsLayer?.renderDebug(graphics, { tileColor: null, collidingTileColor: new Phaser.Display.Color(0, 255, 0, 100), faceColor: null });

    // this.physics.world.drawDebug = true;

    // graphics.lineStyle(2, 0x00ff00, 1);
    // buildingsLayer?.renderDebug(graphics, { tileColor: null, collidingTileColor: new Phaser.Display.Color(0, 255, 0, 100), faceColor: null });
    // // Add debug render for other collision layers
    // if (tree1Layer) {
    //   graphics.lineStyle(2, 0xff0000, 1);
    //   tree1Layer.renderDebug(graphics, { tileColor: null, collidingTileColor: new Phaser.Display.Color(255, 0, 0, 100), faceColor: null });
    // }
    // if (tree2Layer) {
    //   graphics.lineStyle(2, 0x0000ff, 1);
    //   tree2Layer.renderDebug(graphics, { tileColor: null, collidingTileColor: new Phaser.Display.Color(0, 0, 255, 100), faceColor: null });
    // }
    // if (tree3Layer) {
    //   graphics.lineStyle(2, 0xffff00, 1);
    //   tree3Layer.renderDebug(graphics, { tileColor: null, collidingTileColor: new Phaser.Display.Color(255, 255, 0, 100), faceColor: null });
    // }

    // Camera follows player
    this.cameras.main.startFollow(this.player.getSprite(), true, 1, 1);




    const { villagerConfigs, foods, titles, farmerConfig }: { villagerConfigs: Array<VillagerConfig>, foods, titles, farmerConfig} = WorldRender.loadConfigsAndDialogues();
    

 
    this.farmer = new Farmer(this, 34 * this.TILE_SIZE + 6, 17 * this.TILE_SIZE + 10, 2.5 / 3.333, farmerConfig);
    //this.king = new King(this, centerX + 300, centerY - 30, 2.5 / 3.333);

    this.villagers = [
      //new Villager(this, 20 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333),
      new Villager(this, 38 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333, 0, villagerConfigs[3]), //
      new Villager(this, 6 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 1, villagerConfigs[2]), //
      new Villager(this, 15 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 2), //
      new Villager(this, 5 * this.TILE_SIZE, 17 * this.TILE_SIZE, 2.5 / 3.333, 3, villagerConfigs[3]), //
      //new Villager(this, 6 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333),
    
      new Villager(this, 16 * this.TILE_SIZE, 15 * this.TILE_SIZE, 2.5 / 3.333, 4, villagerConfigs[2]), //
      new Villager(this, 21 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333, 5, villagerConfigs[0]), //
      new Villager(this, 52 * this.TILE_SIZE, 26 * this.TILE_SIZE, 2.5 / 3.333, 6, villagerConfigs[0]), //
      new Villager(this, 55 * this.TILE_SIZE, 21 * this.TILE_SIZE, 2.5 / 3.333, 7, villagerConfigs[2]), //
      new Villager(this, 71 * this.TILE_SIZE, 22 * this.TILE_SIZE, 2.5 / 3.333, 8, villagerConfigs[1]), //
      new Villager(this, 47 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 9, villagerConfigs[1]),
      new Villager(this, 52 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 10, villagerConfigs[4]),
      new Villager(this, 58 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 11, villagerConfigs[2]),
      new Villager(this, 67 * this.TILE_SIZE, 5 * this.TILE_SIZE, 2.5 / 3.333, 12),
      new Villager(this, 73 * this.TILE_SIZE, 7 * this.TILE_SIZE, 2.5 / 3.333, 13, villagerConfigs[3]),


      /*      
      //new Villager(this, 6 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333),
    
      new Villager(this, 16 * this.TILE_SIZE, 15 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[2]), //
      new Villager(this, 21 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[0]), //
      */
      
      // [6,6], [15, 6], [5, 16], [6, 13], [16, 13], [21, 19], [52, 30], [55, 19]
      // [71, 20], [74, 6], [63, 4], [58, 6], [53, 6], [48, 6]
      // 
      // KING: [5, 29], 
      //new Villager(this, 16 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[2]),
      //new Villager(this, 25 * this.TILE_SIZE, 15 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[3]),
      //new Villager(this, 35 * this.TILE_SIZE, 20 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[4])
    ]

    this.uiGameState = new UIGameState(foods, titles, this.villagers.length)

    this.king = new King(this, 5 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333);
    this.secondKing = new SecondKing(this, 79 * this.TILE_SIZE, 24 * this.TILE_SIZE, 2.5 / 3.3333)

    this.claude = new Claude(this, 78 * this.TILE_SIZE, 10 * this.TILE_SIZE, 2.5 / 100.333);



    Object.values(WorldRender.ANIMATION_CONFIGS).forEach(config => {
      AnimatedSprite.playAnimation(this, config, config.x * this.TILE_SIZE, config.y * this.TILE_SIZE)
    })

    
    AnimatedSprite.addAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.grass);

    let length = WorldRender.ANIMATION_WITHOUT_X_Y.grass.x.length;

    console.log(WorldRender.ANIMATION_WITHOUT_X_Y.grass.x)
    console.log(WorldRender.ANIMATION_WITHOUT_X_Y.grass.y)


    for (let i = 0; i < length; i++) {

      let x_val = WorldRender.ANIMATION_WITHOUT_X_Y.grass.x[i]
      let y_val = WorldRender.ANIMATION_WITHOUT_X_Y.grass.y[i]

      AnimatedSprite.addSpriteAndPlayAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.grass, x_val , y_val )

      // AnimatedSprite.addSpriteAndPlayAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.grass, 43 * this.TILE_SIZE, 17 * this.TILE_SIZE)

    }

    AnimatedSprite.addAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.flower_one);

    length = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x.length;
    for (let i = 0; i < length; i++) {
      let x_val = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x[i]
      let y_val = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.y[i]
      AnimatedSprite.addSpriteAndPlayAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.flower_one, x_val , y_val )
    }




   






    this.scene.launch('ui', {
      playerHealth: this.player.getHealth(),
      titles: this.uiGameState.getTitlesList(),
      foods: this.uiGameState.getFoodCountsList(),
    });

    this.scene.bringToTop('ui');
    this.events.emit("dialogue:show", "The journey of a thousand Turkey Sandwiches 🥪 begins with a single boar.")


    const spawnAreas = [
      [425, 430, 75, 35], // position of the center on x, on y, half-width on x, on y 
      [520, 130, 170, 130],
      [1060, 455, 140, 30],
    ]
    this.skeletonManager = new SkeletonManager(this, spawnAreas);
    // this.skeletons = this.skeletonManager.getSkeletons();

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

    

    // console.log(now)
    // console.log(this.skeletonNumber)

    this.skeletonManager.createSkeletonAtRandomArea();
    

    

    // follow player
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