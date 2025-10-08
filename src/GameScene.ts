import Phaser from 'phaser';
import { Player } from './Player';
// import { NPC } from './npcs/Npc';
import { TitleList } from './TitleList';
import { UIGameState } from './gamestate/UIGameState';
import { Vampire } from './npcs/Vampire';
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
  private vampireOne!: Vampire;
  private vampireTwo!: Vampire;
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

  private controls!: Phaser.Cameras.Controls.FixedKeyControl;
  private map!: Phaser.Tilemaps.Tilemap;
  private input!: Phaser.Input.InputPlugin;

  constructor() {
    super('GameScene');
  }

  preload() {

    this.load.image("Fruit", "map/tiles/Big_Fruit_Tree.png");
    this.load.image("blacksmith-house", "map/tiles/Blacksmith_House.png");
    this.load.image("grass-2-middle", "map/tiles/Grass_2_Middle.png");
    this.load.image("grass-tiles-2", "map/tiles/Grass_Tiles_2.png");
    this.load.image("path-decorations", "map/tiles/Path_Decoration.png");
    this.load.image("path-middle", "map/tiles/Path_Middle.png");
    this.load.image("windmill", "map/tiles/Windmill.png");
    this.load.image("medium-fruit-tree", "map/tiles/Medium_Fruit_Tree.png");
    this.load.image("oak-leaf-particle", "map/tiles/Oak_Leaf_Particle.png");
    this.load.image("small-fruit-tree", "map/tiles/Small_Fruit_Tree.png");
    this.load.image("fruit-tree-stages", "map/tiles/Fruit_Tree_Stages.png");
    this.load.image("crops", "map/tiles/Crops.png");
    this.load.image("house-5-2", "map/tiles/House_5_2.png");
    this.load.image("house-4-5", "map/tiles/House_4_5.png");
    this.load.image("house-4-3", "map/tiles/House_4_3.png");
    this.load.image("house-2-1", "map/tiles/House_2_1.png");
    this.load.image("house-1-3", "map/tiles/House_1_3.png");
    this.load.image("house-1-2", "map/tiles/House_1_2.png");
    this.load.image("house-abandoned-1-4", "map/tiles/House_Abandoned_1_4.png");
    this.load.image("tent-big", "map/tiles/Tent_Big.png");
    this.load.image("blacksmith-house", "map/tiles/Blacksmith_House.png");
    this.load.image("farm-land-tile", "map/tiles/FarmLand_Tile.png");


    this.load.tilemapTiledJSON('map', 'map/Boar-Knight-Map.json');

    this.load.image('grassy_background', 'grassy_background.png');

    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });

    Vampire.getRequiredAssets().forEach(asset => {
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

    const map = this.make.tilemap({ key: 'map' });
    // Get a list of the tilesets from the map
    const tilesets = map.tilesets;
    console.log(tilesets);

    // const bigFruitTreeTileset = map.addTilesetImage("big-fruit-tree", "big-fruit-tree");
    const grass2MiddleTileset = map.addTilesetImage("Grass_2_Middle", "grass-2-middle");
    const grassTiles2Tileset = map.addTilesetImage("Grass_Tiles_2", "grass-tiles-2");
    const pathDecorationsTileset = map.addTilesetImage("Path_Decoration", "path-decorations");
    const pathMiddleTileset = map.addTilesetImage("Path_Middle", "path-middle");
    const windmillTileset = map.addTilesetImage("Windmill", "windmill");
    const mediumFruitTreeTileset = map.addTilesetImage("Medium_Fruit_Tree", "medium-fruit-tree");
    const oakLeafParticleTileset = map.addTilesetImage("Oak_Leaf_Particle", "oak-leaf-particle");
    const smallFruitTreeTileset = map.addTilesetImage("Small_Fruit_Tree", "small-fruit-tree");
    const fruitTreeStagesTileset = map.addTilesetImage("Fruit_Tree_Stages", "fruit-tree-stages");
    const cropsTileset = map.addTilesetImage("Crops", "crops");
    const house52Tileset = map.addTilesetImage("House_5_2", "house-5-2");
    const house45Tileset = map.addTilesetImage("House_4_5", "house-4-5");
    const house43Tileset = map.addTilesetImage("House_4_3", "house-4-3");
    const house21Tileset = map.addTilesetImage("House_2_1", "house-2-1");
    const house13Tileset = map.addTilesetImage("House_1_3", "house-1-3");
    const house12Tileset = map.addTilesetImage("House_1_2", "house-1-2");
    const houseAbandoned14Tileset = map.addTilesetImage("House_Abandoned_1_4", "house-abandoned-1-4");
    const tentBigTileset = map.addTilesetImage("Tent_Big", "tent-big");
    const blacksmithHouseTileset = map.addTilesetImage("Blacksmith_House", "blacksmith-house");
    const farmLandTileTileset = map.addTilesetImage("FarmLand_Tile", "farm-land-tile");



    map.createLayer("GrassPath", [grass2MiddleTileset, pathMiddleTileset, pathDecorationsTileset, grassTiles2Tileset], 0, 0);

    
    map.createLayer("Boundaries", [grass2MiddleTileset, grassTiles2Tileset, pathDecorationsTileset], 0, 0);


    map.createLayer("Buildings", [house52Tileset, house45Tileset, house43Tileset, house21Tileset, house13Tileset, house12Tileset, houseAbandoned14Tileset, tentBigTileset, blacksmithHouseTileset, cropsTileset, farmLandTileTileset, windmillTileset], 0, 0);


    // map.createLayer("SmallTrees", [fruitTreeStagesTileset], 256, 0);

    map.createLayer("Tree 1", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset], 16 * 16, 0);

    map.createLayer("Tree 2", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset], 0, 0);

    map.createLayer("Tree 3", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset], 16 * 16, 0);



    
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    const cursors = this.input.keyboard.createCursorKeys();

    const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };

    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);


    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);


    // this.cameras.main.setZoom(2);
    this.cameras.main.setZoom(4)


    // const viewportWidth = this.cameras.main.width / this.cameras.main.zoom;
    // const viewportHeight = this.cameras.main.height / this.cameras.main.zoom;
    // this.cameras.main.scrollX = mapWidth - viewportWidth;
    // this.cameras.main.scrollY = 0;
    
    

    this.player = new Player(this, 720, 528);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    // // where all the shit is
    // this.vampireOne = new Vampire(this, 700, 300, 2.5);
    // this.vampireTwo = new Vampire(this, 300, 300, 2.5);
    // this.king = new King(this, 250, 850, 2.5)
    // this.villager = new Villager(this, 500, 700, 2.5)
    // this.houses = [
    //   new House(this, 1170, 190, 0.25),
    //   new House(this, 410, 400, 0.25),
    //   new House(this, 650, 850, 0.25),
    //   new House(this, 840, 460, 0.25),
    //   new House(this, 940, 220, 0.25),
    //   new House(this, 1220, 500, 0.25)
    // ];
    // this.stones = [
    //   new Stone(this, 200, 300, 2.5),
    //   new Stone(this, 800, 200, 2.5),
    //   new Stone(this, 1000, 400, 2.5),
    //   new Stone(this, 250, 500, 2.5),
    //   new Stone(this, 800, 700, 2.5),
    //   new Stone(this, 500, 800, 2.5)
    // ]
    // this.bushes = [
    //   new Bush(this, 430, 120, 4),
    //   new Bush(this, 550, 210, 4),
    //   new Bush(this, 100, 340, 4),
    //   new Bush(this, 1100, 400, 4),
    //   new Bush(this, 340, 580, 4),
    //   new Bush(this, 1160, 690, 4),
    //   new Bush(this, 510, 900, 4)
    // ]
    // this.trees = [
    //   new Tree(this, 370, 100, 4),
    //   new Tree(this, 650, 240, 4),
    //   new Tree(this, 120, 480, 4),
    //   new Tree(this, 1250, 300, 4),
    //   new Tree(this, 390, 700, 4),
    //   new Tree(this, 1300, 720, 4),
    //   new Tree(this, 810, 900, 4)
    // ]
    // // FIX THIS SHIT
    // // this.castle = new Castle(this, 170, 760, 3.3)
    //     // npcs placement
    // this.farmer = new Farmer(this, this.GRID_WIDTH * this.TILE_SIZE - 90, this.GRID_HEIGHT * this.TILE_SIZE - 90, 0.7);






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


  }


  update(time: number, delta: number) {

    //this.controls.update(delta);

    this.player.update();

    // const playerX = this.player.getX();
    // const playerY = this.player.getY();

    // // Proximity checks handled by base NPC class; death trigger is vampire-specific
    // this.vampireOne.checkPlayerInteraction(playerX, playerY);
    // this.vampireTwo.checkPlayerInteraction(playerX, playerY);
    // this.farmer.checkPlayerInteraction(playerX, playerY);
    // this.king.checkPlayerInteraction(playerX, playerY);
    // this.villager.checkPlayerInteraction(playerX, playerY);


    // if (this.player.isAttacking()) {
    //   if (this.vampireOne.isPlayerNear()) this.vampireOne.triggerDeath();
    //   if (this.vampireTwo.isPlayerNear()) this.vampireTwo.triggerDeath();
    // }

    // if (this.player.justPressedFoodKey()) {
    //   console.log("Food key pressed");
    //   console.log("farmer near: ", this.farmer.isPlayerNear());
    //   console.log("king near: ", this.king.isPlayerNear());
    //   console.log("villager near: ", this.villager.isPlayerNear());
    //   if (this.farmer.isPlayerNear()) this.farmer.triggerPickUp()
    //   if (this.king.isPlayerNear()) this.king.triggerDelivery()
    //   if (this.villager.isPlayerNear()) this.villager.triggerDelivery()
    // }

  }
}