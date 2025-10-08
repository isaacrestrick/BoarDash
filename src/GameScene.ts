import Phaser from 'phaser';
import { Player } from './Player';
// import { NPC } from './npcs/Npc';
import { TitleList } from './TitleList';
import { UIGameState } from './gamestate/UIGameState';
import { Skeleton } from './npcs/Skeleton';
import { King } from './npcs/King';
import { Villager } from './npcs/Villager'
import { House } from './static/House'
import { Stone } from './static/Stone'
import { Bush } from './static/Bush'
import { Tree } from './static/Tree'
import { Castle } from './static/Castle'
import { Farmer } from './npcs/Farmer';


export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState!: UIGameState;
  public titleList!: TitleList;
  public foodsList!: TitleList;
  private skeletons!: Skeleton[];
  private king!: King;
  private villager!: Villager;
  private houses!: House[];
  private stones!: Stone[];
  private bushes!: Bush[];
  private trees!: Tree[];
  private castle!: Castle;
  private farmer!: Farmer;
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('grassy_background', 'grassy_background.png');

    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });

    Skeleton.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    King.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Villager.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    House.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Stone.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Bush.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Tree.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Castle.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });
    
    Farmer.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.player = new Player(this, 720, 528);

    // where all the shit is
    this.skeletons = [
      new Skeleton(this, 700, 300, 3.5),
      new Skeleton(this, 300, 300, 3.5)
    ]
    this.king = new King(this, 250, 850, 2.5)
    this.villager = new Villager(this, 500, 700, 2.5)
    this.houses = [
      new House(this, 1170, 190, 0.25),
      new House(this, 410, 400, 0.25),
      new House(this, 650, 850, 0.25),
      new House(this, 840, 460, 0.25),
      new House(this, 940, 220, 0.25),
      new House(this, 1220, 500, 0.25)
    ];
    this.stones = [
      new Stone(this, 200, 300, 2.5),
      new Stone(this, 800, 200, 2.5),
      new Stone(this, 1000, 400, 2.5),
      new Stone(this, 250, 500, 2.5),
      new Stone(this, 800, 700, 2.5),
      new Stone(this, 500, 800, 2.5)
    ]
    this.bushes = [
      new Bush(this, 430, 120, 4),
      new Bush(this, 550, 210, 4),
      new Bush(this, 100, 340, 4),
      new Bush(this, 1100, 400, 4),
      new Bush(this, 340, 580, 4),
      new Bush(this, 1160, 690, 4),
      new Bush(this, 510, 900, 4)
    ]
    this.trees = [
      new Tree(this, 370, 100, 4),
      new Tree(this, 650, 240, 4),
      new Tree(this, 120, 480, 4),
      new Tree(this, 1250, 300, 4),
      new Tree(this, 390, 700, 4),
      new Tree(this, 1300, 720, 4),
      new Tree(this, 810, 900, 4)
    ]
    // FIX THIS SHIT
    // this.castle = new Castle(this, 170, 760, 3.3)

    this.uiGameState = new UIGameState()
    this.titleList = new TitleList(
      this,
      ["Titles", ...this.uiGameState.getTitlesList()],
      40,
      60,
      28
    );
    this.foodsList = new TitleList(
      this,
      ["Foods", ...this.uiGameState.getFoodCountsList()],
      this.GRID_WIDTH * this.TILE_SIZE - 40,
      60,
      28,
      'right'
    );

    // npcs placement
    this.farmer = new Farmer(this, this.GRID_WIDTH * this.TILE_SIZE - 90, this.GRID_HEIGHT * this.TILE_SIZE - 90, 0.7);
  }


  update() {

    this.player.update();

    const playerX = this.player.getX();
    const playerY = this.player.getY();

    // follow player
    this.skeletons.forEach(v => v.updateFollow(playerX, playerY, 50));

    // Proximity checks handled by base NPC class; death trigger is skeleton-specific
    this.skeletons[0].checkPlayerInteraction(playerX, playerY);
    this.skeletons[1].checkPlayerInteraction(playerX, playerY);
    this.farmer.checkPlayerInteraction(playerX, playerY);
    this.king.checkPlayerInteraction(playerX, playerY);
    this.villager.checkPlayerInteraction(playerX, playerY);


    if (this.player.isAttacking()) {
      if (this.skeletons[0].isPlayerNear()) this.skeletons[0].triggerDeath();
      if (this.skeletons[1].isPlayerNear()) this.skeletons[1].triggerDeath();
    }

    if (this.player.justPressedFoodKey()) {
      console.log("Food key pressed");
      console.log("farmer near: ", this.farmer.isPlayerNear());
      console.log("king near: ", this.king.isPlayerNear());
      console.log("villager near: ", this.villager.isPlayerNear());
      if (this.farmer.isPlayerNear()) this.farmer.triggerPickUp()
      if (this.king.isPlayerNear()) this.king.triggerDelivery()
      if (this.villager.isPlayerNear()) this.villager.triggerDelivery()
    }

  }
}