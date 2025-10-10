import Phaser from 'phaser';
import { Player } from '../Player';
import { UIGameState } from '../gamestate/UIGameState';
import { Skeleton } from '../npcs/Skeleton';
import { King } from '../npcs/King';
import { SecondKing } from '../npcs/SecondKing';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Farmer } from '../npcs/Farmer';


export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState!: UIGameState;
  public skeletons!: Skeleton[];
  private king!: King;
  private secondKing!: SecondKing
  private villagers!: Villager[];
  private farmer!: Farmer;
  private readonly TILE_SIZE = 16;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;
  private lastSpawnTime = 0

  private controls!: Phaser.Cameras.Controls.FixedKeyControl;
  private map!: Phaser.Tilemaps.Tilemap;

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
    this.load.image("castle-tile", "map/tiles/Castle.png");
    this.load.image("food-signage", "Food-Items-Combined.png")


    this.load.tilemapTiledJSON('map', 'map/Boar-Knight-Map.json');

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

    SecondKing.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Villager.getRequiredAssets().forEach(asset => {
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
    const castleTileset = map.addTilesetImage("Castle", "castle-tile")
    const foodSignageTileset = map.addTilesetImage("Food-Items-Combined", "food-signage");



    map.createLayer("GrassPath", [grass2MiddleTileset, pathMiddleTileset, pathDecorationsTileset, grassTiles2Tileset].filter(t => t !== null), 0, 0);


    map.createLayer("Boundaries", [grass2MiddleTileset, grassTiles2Tileset, pathDecorationsTileset].filter(t => t !== null), 0, 0);


    const buildingsLayer = map.createLayer("Buildings", [castleTileset, grassTiles2Tileset, house52Tileset, house45Tileset, house43Tileset, house21Tileset, house13Tileset, house12Tileset, houseAbandoned14Tileset, tentBigTileset, blacksmithHouseTileset, cropsTileset, farmLandTileTileset, windmillTileset].filter(t => t !== null), 0, 0);


    const tree1Layer = map.createLayer("Tree 1", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);

    const tree2Layer = map.createLayer("Tree 2", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset, foodSignageTileset].filter(t => t !== null), 0, 0);

    const tree3Layer = map.createLayer("Tree 3", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);


    // Enable collision on all tiles in these layers (excluding empty tiles with index -1)
    console.log('Setting up collisions...');
    console.log('buildingsLayer:', buildingsLayer);
    console.log('tree1Layer:', tree1Layer);

    buildingsLayer?.setCollisionByExclusion([-1]);
    tree1Layer?.setCollisionByExclusion([-1]);
    tree2Layer?.setCollisionByExclusion([-1]);
    tree3Layer?.setCollisionByExclusion([-1]);

    console.log('buildingsLayer collision enabled:', buildingsLayer?.layer.collideIndexes);

    //tree and buildings are collision layers


    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
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

    // Add collisions between player and layers
    if (buildingsLayer) this.physics.add.collider(this.player.getSprite(), buildingsLayer);
    if (tree1Layer) this.physics.add.collider(this.player.getSprite(), tree1Layer);
    if (tree2Layer) this.physics.add.collider(this.player.getSprite(), tree2Layer);
    if (tree3Layer) this.physics.add.collider(this.player.getSprite(), tree3Layer);

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

    // Add collisions between skeletons and layers
    this.skeletons.forEach(skeleton => {
      if (buildingsLayer) this.physics.add.collider(skeleton.getSprite(), buildingsLayer);
      if (tree1Layer) this.physics.add.collider(skeleton.getSprite(), tree1Layer);
      if (tree2Layer) this.physics.add.collider(skeleton.getSprite(), tree2Layer);
      if (tree3Layer) this.physics.add.collider(skeleton.getSprite(), tree3Layer);
    });

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

    this.uiGameState = new UIGameState(foods, titles)

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

    this.farmer = new Farmer(this, 34 * this.TILE_SIZE + 6, 17 * this.TILE_SIZE + 10 , 2.5 / 3.333, farmerConfig);
    //this.king = new King(this, centerX + 300, centerY - 30, 2.5 / 3.333);

    this.villagers = [
      //new Villager(this, 20 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333),
      new Villager(this, 38 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[0]),

      new Villager(this, 6 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[1]),
      new Villager(this, 15 * this.TILE_SIZE, 6 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[2]),
      new Villager(this, 5 * this.TILE_SIZE, 16 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[3]),
      new Villager(this, 6 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[4]),
      
      new Villager(this, 16 * this.TILE_SIZE, 13 * this.TILE_SIZE, 2.5 / 3.333),
      new Villager(this, 21 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333),
      // [6,6], [15, 6], [5, 16], [6, 13], [16, 13], [21, 19], [52, 30], [55, 19]
      // [71, 20], [74, 6], [63, 4], [58, 6], [53, 6], [48, 6]
      // 
      // KING: [5, 29], 
      //new Villager(this, 16 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[2]),
      //new Villager(this, 25 * this.TILE_SIZE, 15 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[3]),
      //new Villager(this, 35 * this.TILE_SIZE, 20 * this.TILE_SIZE, 2.5 / 3.333, villagerConfigs[4])
    ]  

    this.king = new King(this, 5 * this.TILE_SIZE, 29 * this.TILE_SIZE, 2.5 / 3.333);
    this.secondKing = new SecondKing(this, 79 * this.TILE_SIZE, 24 * this.TILE_SIZE,  2.5 / 3.3333)

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
    
    
    // console.log(now)
    if (this.skeletons.length < 12) {
      
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
      if (now - this.lastSpawnTime > 4000) {
        this.skeletons.push(new Skeleton(this, x, y, 3.5 / 3.333))
        this.lastSpawnTime = now
      }
      // console.log(minX, minY, maxX, maxY, x, y)
      console.log(this.lastSpawnTime, this.skeletons.length)
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