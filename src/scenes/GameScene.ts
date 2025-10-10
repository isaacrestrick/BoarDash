import Phaser from 'phaser';
import { Player } from '../Player';
import { UIGameState } from '../gamestate/UIGameState';
import { Skeleton } from '../npcs/Skeleton';
import { King } from '../npcs/King';
import { SecondKing } from '../npcs/SecondKing';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Farmer } from '../npcs/Farmer';

class WorldRender {
  static buildingsLayer?: Phaser.Tilemaps.TilemapLayer;
  static collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];
  static map :Phaser.Tilemaps.Tilemap;
  static load_assets(scene: GameScene)  {
    scene.load.image("Fruit", "map/tiles/Big_Fruit_Tree.png");
    scene.load.image("blacksmith-house", "map/tiles/Blacksmith_House.png");
    scene.load.image("grass-2-middle", "map/tiles/Grass_2_Middle.png");
    scene.load.image("grass-tiles-2", "map/tiles/Grass_Tiles_2.png");
    scene.load.image("path-decorations", "map/tiles/Path_Decoration.png");
    scene.load.image("path-middle", "map/tiles/Path_Middle.png");
    scene.load.image("windmill", "map/tiles/Windmill.png");
    scene.load.image("medium-fruit-tree", "map/tiles/Medium_Fruit_Tree.png");
    scene.load.image("oak-leaf-particle", "map/tiles/Oak_Leaf_Particle.png");
    scene.load.image("small-fruit-tree", "map/tiles/Small_Fruit_Tree.png");
    scene.load.image("fruit-tree-stages", "map/tiles/Fruit_Tree_Stages.png");
    scene.load.image("crops", "map/tiles/Crops.png");
    scene.load.image("house-5-2", "map/tiles/House_5_2.png");
    scene.load.image("house-4-5", "map/tiles/House_4_5.png");
    scene.load.image("house-4-3", "map/tiles/House_4_3.png");
    scene.load.image("house-2-1", "map/tiles/House_2_1.png");
    scene.load.image("house-1-3", "map/tiles/House_1_3.png");
    scene.load.image("house-1-2", "map/tiles/House_1_2.png");
    scene.load.image("house-abandoned-1-4", "map/tiles/House_Abandoned_1_4.png");
    scene.load.image("tent-big", "map/tiles/Tent_Big.png");
    scene.load.image("blacksmith-house", "map/tiles/Blacksmith_House.png");
    scene.load.image("farm-land-tile", "map/tiles/FarmLand_Tile.png");
    scene.load.image("castle-tile", "map/tiles/Castle.png");
    scene.load.image("food-signage", "Food-Items-Combined.png");
    scene.load.image("water-bridge","map/tiles/Water_Bridge.png");
    scene.load.image("outdoor-decor", "map/tiles/Outdoor_Decor.png");
    scene.load.image("water-troughs", "map/tiles/Water_Troughs.png");
    scene.load.image("hay-bales", "map/tiles/Hay_Bales.png");
    scene.load.image("fences", "map/tiles/Fences.png");
    scene.load.tilemapTiledJSON('map', 'map/Boar-Knight-Map.json');
    scene.load.image('grassy_background', 'grassy_background.png');
     scene.load.image("water-bridge","map/tiles/Water_Bridge.png");
    scene.load.image("outdoor-decor", "map/tiles/Outdoor_Decor.png");
    scene.load.image("water-troughs", "map/tiles/Water_Troughs.png");
    scene.load.image("hay-bales", "map/tiles/Hay_Bales.png");
    scene.load.image("fences", "map/tiles/Fences.png");
  }

  static create(scene: GameScene) {
    WorldRender.collisionLayers = [];
    WorldRender.map = scene.make.tilemap({key: 'map'})
    const tilesets = WorldRender.map.tilesets;
    const grass2MiddleTileset = WorldRender.map.addTilesetImage("Grass_2_Middle", "grass-2-middle");
    const grassTiles2Tileset = WorldRender.map.addTilesetImage("Grass_Tiles_2", "grass-tiles-2");
    const pathDecorationsTileset = WorldRender.map.addTilesetImage("Path_Decoration", "path-decorations");
    const pathMiddleTileset = WorldRender.map.addTilesetImage("Path_Middle", "path-middle");
    const windmillTileset = WorldRender.map.addTilesetImage("Windmill", "windmill");
    const mediumFruitTreeTileset = WorldRender.map.addTilesetImage("Medium_Fruit_Tree", "medium-fruit-tree");
    const oakLeafParticleTileset = WorldRender.map.addTilesetImage("Oak_Leaf_Particle", "oak-leaf-particle");
    const smallFruitTreeTileset = WorldRender.map.addTilesetImage("Small_Fruit_Tree", "small-fruit-tree");
    const fruitTreeStagesTileset = WorldRender.map.addTilesetImage("Fruit_Tree_Stages", "fruit-tree-stages");
    const cropsTileset = WorldRender.map.addTilesetImage("Crops", "crops");
    const house52Tileset = WorldRender.map.addTilesetImage("House_5_2", "house-5-2");
    const house45Tileset = WorldRender.map.addTilesetImage("House_4_5", "house-4-5");
    const house43Tileset = WorldRender.map.addTilesetImage("House_4_3", "house-4-3");
    const house21Tileset = WorldRender.map.addTilesetImage("House_2_1", "house-2-1");
    const house13Tileset = WorldRender.map.addTilesetImage("House_1_3", "house-1-3");
    const house12Tileset = WorldRender.map.addTilesetImage("House_1_2", "house-1-2");
    const houseAbandoned14Tileset = WorldRender.map.addTilesetImage("House_Abandoned_1_4", "house-abandoned-1-4");
    const tentBigTileset = WorldRender.map.addTilesetImage("Tent_Big", "tent-big");
    const blacksmithHouseTileset = WorldRender.map.addTilesetImage("Blacksmith_House", "blacksmith-house");
    const farmLandTileTileset = WorldRender.map.addTilesetImage("FarmLand_Tile", "farm-land-tile");
    const castleTileset = WorldRender.map.addTilesetImage("Castle", "castle-tile")
    const foodSignageTileset = WorldRender.map.addTilesetImage("Food-Items-Combined", "food-signage");
    const bigFruitTreeTileset = WorldRender.map.addTilesetImage("big-fruit-tree", "big-fruit-tree");
    const HayTileSet = WorldRender.map.addTilesetImage("Hay_Bales", "hay-bales");
    const WaterTroughTileSet = WorldRender.map.addTilesetImage("Water_Troughs", "water-troughs");
    const WaterBridgeTileSet = WorldRender.map.addTilesetImage("Water_Bridge", "water-bridge");
    const FencesTileSet = WorldRender.map.addTilesetImage("Fences", "fences");
    const OutdoorDecorTileSet = WorldRender.map.addTilesetImage("Outdoor_Decor", "outdoor-decor");

    WorldRender.map.createLayer("GrassPath", [farmLandTileTileset, grass2MiddleTileset, pathMiddleTileset, pathDecorationsTileset, grassTiles2Tileset].filter(t => t !== null), 0, 0);
    WorldRender.map.createLayer("Grass_Textures", [OutdoorDecorTileSet].filter(t => t !== null), 0, 0);
    const LogsLayer = WorldRender.map.createLayer("Logs", [OutdoorDecorTileSet].filter(t => t !== null), 0, 0);
    WorldRender.map.createLayer("Boundaries", [grass2MiddleTileset, grassTiles2Tileset, pathDecorationsTileset].filter(t => t !== null), 0, 0);
    const WaterMoundLayer = WorldRender.map.createLayer("Water_Mound", [WaterBridgeTileSet].filter(t => t !== null), 0, 0)

    const buildingsLayer = WorldRender.map.createLayer("Buildings", [WaterBridgeTileSet, castleTileset, grassTiles2Tileset, house52Tileset, house45Tileset, house43Tileset, house21Tileset, house13Tileset, house12Tileset, houseAbandoned14Tileset, tentBigTileset, blacksmithHouseTileset, cropsTileset, farmLandTileTileset, windmillTileset].filter(t => t !== null), 0, 0);
    
    WorldRender.map.createLayer("Farm", [cropsTileset, farmLandTileTileset, WaterTroughTileSet, HayTileSet].filter(t => t !== null), 0, 0);


    const fencesLayer = WorldRender.map.createLayer("Fences", [FencesTileSet].filter(t => t !== null), 0, 0)
    const tree1Layer = WorldRender.map.createLayer("Tree 1", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);
    const tree2Layer = WorldRender.map.createLayer("Tree 2", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset, foodSignageTileset].filter(t => t !== null), 0, 0);
    const tree3Layer = WorldRender.map.createLayer("Tree 3", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);



    WorldRender.buildingsLayer = buildingsLayer ?? undefined;
    if (buildingsLayer) WorldRender.collisionLayers.push(buildingsLayer);
    buildingsLayer?.setCollisionByExclusion([-1]);
    if (fencesLayer) WorldRender.collisionLayers.push(fencesLayer);
    fencesLayer?.setCollisionByExclusion([-1]);
    if (tree1Layer) WorldRender.collisionLayers.push(tree1Layer);
    tree1Layer?.setCollisionByExclusion([-1]);
    if (tree2Layer) WorldRender.collisionLayers.push(tree2Layer);
    tree2Layer?.setCollisionByExclusion([-1]);
    if (tree3Layer) WorldRender.collisionLayers.push(tree3Layer);
    tree3Layer?.setCollisionByExclusion([-1]);
    if (LogsLayer) WorldRender.collisionLayers.push(LogsLayer);
    LogsLayer?.setCollisionByExclusion([-1]);
  }


  
}


export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState!: UIGameState;
  public skeletons!: Skeleton[];
  private buildingsLayer?: Phaser.Tilemaps.TilemapLayer;
  private king!: King;
  private secondKing!: SecondKing
  private villagers!: Villager[];
  private farmer!: Farmer;
  private readonly TILE_SIZE = 16;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;
  private lastSpawnTime = 0
  public skeletonNumber = 12
  public skeletonSpawnDelay = 4000

  private controls!: Phaser.Cameras.Controls.FixedKeyControl;
  private map!: Phaser.Tilemaps.Tilemap;


  private collisionLayers!: Phaser.Tilemaps.TilemapLayer[];

  constructor() {
    super('GameScene');
  }

  preload() {

    WorldRender.load_assets(this);

    
    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });

    let objects = [Skeleton, King, SecondKing, Villager,Farmer];

    objects.forEach((object) => {
      object.getRequiredAssets().forEach(asset => {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      });
    })
  }

  create() {

    WorldRender.create(this);

    // const map = this.make.tilemap({ key: 'map' });
    // // Get a list of the tilesets from the map
    // const tilesets = map.tilesets;
    // console.log(tilesets);

    


   

 

    
    this.buildingsLayer = WorldRender.buildingsLayer;
    this.collisionLayers = WorldRender.collisionLayers;




    console.log('buildingsLayer collision enabled:', this.buildingsLayer?.layer.collideIndexes);



    const mapWidth = WorldRender.map.widthInPixels;
    const mapHeight = WorldRender.map.heightInPixels;




    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

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


    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);


    // this.cameras.main.setZoom(2);
    this.cameras.main.setZoom(4)


    // const viewportWidth = this.cameras.main.width / this.cameras.main.zoom;
    // const viewportHeight = this.cameras.main.height / this.cameras.main.zoom;
    // this.cameras.main.scrollX = mapWidth - viewportWidth;
    // this.cameras.main.scrollY = 0;



    this.player = new Player(this, 36 * this.TILE_SIZE, 19 * this.TILE_SIZE)//720, 528); // 35 18



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



    // 0 skeletons initially
    this.skeletons = []
    this.lastSpawnTime = 0

    

    const villagerConfigs: Array<VillagerConfig> = [
      {
        food: "Boris's Borscht 🍲",
        title: "Borscht Dasher 🍲",
        greetingDialogue: "Howdy",
        failureDialogue: "I ordered borscht not boar!",
        successDialogue: "I guess that makes you a Borscht Dasher 🍲!",
        key: 'villager-mary-idle'
      },
      {
        food: "Hubert's Jakartan fusion tacos 🌮🇮🇩",
        title: "Jakartan Spartan 🌮🇮🇩",
        greetingDialogue: "You seem a little less pixelated than the rest of us",
        failureDialogue: "I need to bulk where are my tacos bro",
        successDialogue: "Thanks for the tacos. Needed these",
        key: 'villager-katy-idle'
      },
      {
        food: "Isaac's Icy Cold Brew 🧊☕",
        title: "Ice Ice Maybe 🧊☕",
        greetingDialogue: "Good morning Boar Dasher",
        failureDialogue: "I said extra ice 🧊",
        successDialogue: "This is a lot of ice 🧊 but thanks",
        key: 'villager-bob-idle'
      },
      {
        food: "Ol McDonald's Fries 🍟",
        title: "Good Frieday 🍟",
        greetingDialogue: "Have you seen that clown…",
        failureDialogue: "I didn't order a Kingly Burger 🍔",
        successDialogue: "Happy Frieday 🍟!",
        key: 'villager-buba-idle'
      },
      {
        food: "Pizza 🍕 Pizza 🍕",
        title: "Caesar 🍕",
        greetingDialogue: "Rome wasn't built in a day, but this game took 6️⃣",
        failureDialogue: "Et Tu, Boar Dasher?",
        successDialogue: "I love pizza 🍕. Thanks!",
        key: 'villager-fin-idle'
      },
    ]
    const foods = [
      "Turkey Sandwiches 🥪",
      ...villagerConfigs.map(config => config.food),
      "Kingly Burgers 🍔",
    ];
    const titles = [
      "Lord of Boars 🐗",
      "Slayer of Skeletons ☠️",
      "Deliverer of Turkey Sandwiches 🥪",
      ...villagerConfigs.map(config => config.title),
      "Favors owed by the king 👑",
    ];

    const farmerConfig = {
      key: 'farmer-idle',
      greetingDialogue: "Good day on the farm today.",
      foods: foods,
      foodSingulars: {
        "Turkey Sandwiches 🥪": "Turkey Sandwich 🥪",
        ...Object.fromEntries(villagerConfigs.map(config => [config.food, config.food])),
        "Kingly Burgers 🍔": "Kingly Burger 🍔"
      }
    }

    this.farmer = new Farmer(this, 34 * this.TILE_SIZE + 6, 17 * this.TILE_SIZE + 10, 2.5 / 3.333, farmerConfig);
    //this.king = new King(this, centerX + 300, centerY - 30, 2.5 / 3.333);

    this.villagers = [
      //new Villager(this, 20 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333),
      new Villager(this, 38 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333, 0, villagerConfigs[3]), //
      new Villager(this, 6 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 1, villagerConfigs[2]), //
      new Villager(this, 15 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 2), //
      new Villager(this, 5 * this.TILE_SIZE, 16 * this.TILE_SIZE, 2.5 / 3.333, 3, villagerConfigs[3]), //
      //new Villager(this, 6 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333),
    
      new Villager(this, 16 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333, 4, villagerConfigs[2]), //
      new Villager(this, 21 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333, 5, villagerConfigs[0]), //
      new Villager(this, 52 * this.TILE_SIZE, 30 * this.TILE_SIZE, 2.5 / 3.333, 6, villagerConfigs[0]), //
      new Villager(this, 55 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333, 7, villagerConfigs[2]), //
      new Villager(this, 71 * this.TILE_SIZE, 20 * this.TILE_SIZE, 2.5 / 3.333, 8, villagerConfigs[1]), //
      new Villager(this, 48 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 9, villagerConfigs[1]),
      new Villager(this, 53 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 10, villagerConfigs[4]),
      new Villager(this, 58 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 11, villagerConfigs[2]),
      new Villager(this, 63 * this.TILE_SIZE, 4 * this.TILE_SIZE, 2.5 / 3.333, 12),
      new Villager(this, 74 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, 13, villagerConfigs[3]),
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

    //    this.dialogueManager.show("The journey of a thousand Turkey Sandwiches 🥪 begins with a single boar.")

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

    if (this.uiGameState.allowedToDeliverBurger()) {
      this.skeletonNumber = 150
      this.skeletonSpawnDelay = 50
    } else {
      this.skeletonNumber = 12
      this.skeletonSpawnDelay = 3500
    }

    // console.log(now)
    // console.log(this.skeletonNumber)
    if (this.skeletons.length < this.skeletonNumber) {

      // spawn everywhere
      // const minX = 0
      // const maxX = 79 * 16
      // const minY = 0
      // const maxY = 32 * 16
      // const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX
      // const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY

      // spawn areas
      const spawnAreas = [
        [425, 430, 75, 35], // position of the center on x, on y, half-width on x, on y 
        [520, 130, 170, 130],
        [1060, 455, 140, 30],
      ]
      const randomArea = spawnAreas[
        Math.floor(Math.random() * spawnAreas.length)
      ]
      const minX = randomArea[0] - randomArea[2]
      const maxX = randomArea[0] + randomArea[2]
      const minY = randomArea[1] - randomArea[3]
      const maxY = randomArea[1] + randomArea[3]
      const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX
      const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY

      if (now - this.lastSpawnTime > this.skeletonSpawnDelay) {
        let skeleton = new Skeleton(this, x, y, 3.5 / 3.333)
          if (this.buildingsLayer) {
            this.physics.add.collider(skeleton.getSprite(), this.buildingsLayer);
          }
        this.skeletons.push(skeleton)
        this.lastSpawnTime = now
      }
      // console.log(minX, minY, maxX, maxY, x, y)
      // console.log(this.lastSpawnTime, this.skeletons.length)
    }

    

    // follow player
    this.skeletons.forEach(v => v.updateFollow(playerX, playerY, 50))

    // attack player
    this.skeletons.forEach(s => {
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
    this.skeletons.forEach(skeleton => {
      skeleton.checkPlayerInteraction(playerX, playerY);
    })
    this.farmer.checkPlayerInteraction(playerX, playerY);
    this.king.checkPlayerInteraction(playerX, playerY);
    this.secondKing.checkPlayerInteraction(playerX, playerY);
    this.villagers.forEach(villager => {
      villager.checkPlayerInteraction(playerX, playerY);
    });

    if (this.player.isAttacking()) {
      this.skeletons.forEach(skeleton => {
        if (skeleton.isPlayerNear()) {
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
        if (villager.isPlayerNear()) villager.triggerDelivery();
      });
    }
  }
}