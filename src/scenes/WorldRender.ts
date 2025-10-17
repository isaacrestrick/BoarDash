import type { VillagerConfig } from "../npcs/Villager";
import { AnimatedSprite } from "../classes/AnimatedSprite";
export class WorldRender {
    static buildingsLayer?: Phaser.Tilemaps.TilemapLayer;
    static collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    static map :Phaser.Tilemaps.Tilemap;


    static loadConfigsAndDialogues() {
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

          return {villagerConfigs, foods, titles, farmerConfig}
      
    }

  
  
    //config.name-sprite will map to whatever is in imgPath
    //config.name-config.action will map to whatever is 
    static ANIMATION_CONFIGS ={
      windmill: {
        imgPath: "Cute_Fantasy/House/Buildings/Special_Buildings/Windmill/Windmill_Sail_Anim.png",
        num_columns: 4,
        num_rows: 1,
        name: "windmill",
        start_frame: 0,
        end_frame: 3,
        frame_rate: 3,
        repeat: -1,
        action: "idle", 
        x: 36, 
        y : 13
      },
      idle_cow: {
        imgPath: "Cute_Fantasy/Animals/Cow/Cow_01.png",
        num_columns: 8,
        num_rows: 15,
        name: "cow",
        start_frame: 48,
        end_frame: 54,
        frame_rate: 4,
        repeat: -1,
        action: "eating", 
        x: 37, 
        y : 6
      },
      sleeping_sheep: {
        imgPath: "Cute_Fantasy/Animals/Sheep/Sheep_01.png",
        num_columns: 8,
        num_rows: 15,
        name: "sheep",
        start_frame: 88,
        end_frame: 95,
        frame_rate: 4,
        repeat: -1,
        action: "sleeping",
        x: 34,
        y: 9
      },
      idling_sheep: {
        imgPath: "Cute_Fantasy/Animals/Sheep/Sheep_01.png",
        num_columns: 8,
        num_rows: 15,
        name: "sheep",
        start_frame: 88,
        end_frame: 95,
        frame_rate: 4,
        repeat: -1,
        action: "sleeping",
        x: 34,
        y: 9
      },
      idling_swan: {
        imgPath: "Cute_Fantasy/Animals/Swan/Swan_01.png",
        num_columns: 8,
        num_rows: 20,
        name: "swan",
        start_frame: 56,
        end_frame: 57,
        frame_rate: 3,
        repeat: -1, 
        action: "idling",
        x: 2,
        y: 28
      },
      corn_growing: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 2,
        end_frame: 5,
        frame_rate: .3,
        name: "corn",
        action: "growing",
        repeat: -1,
        x: 29,
        y: 6
      },
      corn_growing_second: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 2,
        end_frame: 5,
        frame_rate: .5,
        name: "corn",
        action: "growing-seconds",
        repeat: -1,
        x: 30,
        y: 6
      },
      tomato_growing: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 9,
        end_frame: 12,
        frame_rate: .4,
        name: "tomato",
        action: "growing",
        repeat: -1,
        x: 29,
        y: 7
      },
      tomato_growing_two: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 9,
        end_frame: 12,
        frame_rate: .6,
        name: "tomato",
        action: "growing-two",
        repeat: -1,
        x: 30,
        y: 7
      },
  
      carrot_growing: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 16,
        end_frame: 19,
        frame_rate: .6,
        name: "carrot",
        action: "growing",
        repeat: -1,
        x: 29,
        y: 8
      },
  
      carrot_growing_two: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 16,
        end_frame: 19,
        frame_rate: .4,
        name: "carrot",
        action: "growing-two",
        repeat: -1,
        x: 30,
        y: 8
      },
  
      //23 - 26
  
      eggplant: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 23,
        end_frame: 26,
        frame_rate: .8,
        name: "eggplant",
        action: "growing",
        repeat: -1,
        x: 29,
        y: 9
      },
  
      eggplant_two: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 23,
        end_frame: 26,
        frame_rate: .4,
        name: "eggplant",
        action: "growing-two",
        repeat: -1,
        x: 30,
        y: 9
      },
  
      //30 - 33
      corn: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 30,
        end_frame: 33,
        frame_rate: 1,
        name: "corn",
        action: "growing",
        repeat: -1,
        x: 29,
        y: 10
      },
  
      corn_two: {
        imgPath: "Cute_Fantasy/Crops/Crops.png",
        num_columns: 7,
        num_rows: 22,
        start_frame: 30,
        end_frame: 33,
        frame_rate: .5,
        name: "corn",
        action: "growing-two",
        repeat: -1,
        x: 30,
        y: 10
      },
  
      anvil : {
        imgPath: "Cute_Fantasy/House/Objects/Anvil_Anim.png",
        num_columns: 8,
        num_rows: 1,
        start_frame: 0, 
        end_frame: 7,
        frame_rate: 12,
        name: "anvil", 
        action: "idle",
        repeat: -1, 
        x: 78,
        y: 7
      }
  
  
  
    }
  
  
  
    static ANIMATION_WITHOUT_X_Y = {
      grass: {
        imgPath: "Cute_Fantasy/Outdoor decoration/Outdoor_Decor_Animations/Grass_Animations/Grass_2_Anim.png",
        num_columns: 8,
        num_rows: 1,
        name: "grass",
        start_frame: 0,
        end_frame: 7,
        frame_rate: 3,
        repeat: -1,
        action: "idle",
        depth: -1,
        // x: [38, 43, 51,46, 44, 70],
        // y: [22, 17, 15, 13, 17, 17], 
        x: [],
        y: [],
      }, 
      flower_one: {
        imgPath: "Cute_Fantasy/Outdoor decoration/Outdoor_Decor_Animations/Grass_Animations/Flower_Grass_1_Anim.png",
        num_columns: 8,
        num_rows: 1,
        name: "flower-1",
        start_frame: 0,
        end_frame: 7,
        frame_rate: 3,
        repeat: -1,
        action: "idle-1",
        depth: -1,
        // x: [33, 29, 13, 9, 14, 11, 22, 41],
        // y: [17, 14, 22, 20, 17, 29, 24, 21], 
        x: [],
        y: [],
      }
    }
  
  
  
  
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
      scene.load.image('ui-heart', 'Heart.png');


      Object.values(WorldRender.ANIMATION_CONFIGS).forEach(config => {
        AnimatedSprite.preloadAssets(scene, config)
      })
  
      Object.values(WorldRender.ANIMATION_WITHOUT_X_Y).forEach(config => {
        AnimatedSprite.preloadAssets(scene, config);
      })
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
  
      const grassPathLayer = WorldRender.map.createLayer("GrassPath", [farmLandTileTileset, grass2MiddleTileset, pathMiddleTileset, pathDecorationsTileset, grassTiles2Tileset].filter(t => t !== null), 0, 0);
      WorldRender.map.createLayer("Grass_Textures", [OutdoorDecorTileSet].filter(t => t !== null), 0, 0);
  
  
      const grassTexturesLayer = WorldRender.map.getLayer('Grass_Textures')?.tilemapLayer;
      if (!grassTexturesLayer) return;
  
      const results: { tileX: number; tileY: number; worldX: number; worldY: number }[] = [];
      grassTexturesLayer.forEachTile(tile => {
        if (tile.index === -1) return; // skip empty cells
        results.push({
          tileX: tile.x,
          tileY: tile.y,
          worldX: tile.pixelX,
          worldY: tile.pixelY,
        });
      });
  
      // Choose 100 random points in results and push their x and y to ANIMATION_WITHOUT_X_Y.grass.x and .y
      if (results.length > 0 && typeof WorldRender.ANIMATION_WITHOUT_X_Y !== 'undefined' && WorldRender.ANIMATION_WITHOUT_X_Y.grass) {
        // Initialize x and y arrays if not exist
        if (!Array.isArray(WorldRender.ANIMATION_WITHOUT_X_Y.grass.x)) {
          WorldRender.ANIMATION_WITHOUT_X_Y.grass.x = [];
        }
        if (!Array.isArray(WorldRender.ANIMATION_WITHOUT_X_Y.grass.y)) {
          WorldRender.ANIMATION_WITHOUT_X_Y.grass.y = [];
        }
        // Shuffle results and take top 100
        const shuffled = results.slice().sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 100);
        selected.forEach(point => {
          WorldRender.ANIMATION_WITHOUT_X_Y.grass.x.push(point.worldX);
          WorldRender.ANIMATION_WITHOUT_X_Y.grass.y.push(point.worldY);
        });
      }
  
      if (results.length > 0 && typeof WorldRender.ANIMATION_WITHOUT_X_Y !== 'undefined' && WorldRender.ANIMATION_WITHOUT_X_Y.flower_one) {
        // Initialize x and y arrays if not exist
        if (!Array.isArray(WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x)) {
          WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x = [];
        }
        if (!Array.isArray(WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.y)) {
          WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.y = [];
        }
        // Shuffle results and take top 100
        const shuffled = results.slice().sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 100);
        selected.forEach(point => {
          WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x.push(point.worldX);
          WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.y.push(point.worldY);
        });
      }
  
  
  
      const LogsLayer = WorldRender.map.createLayer("Logs", [OutdoorDecorTileSet].filter(t => t !== null), 0, 0);
      const boundariesLayer = WorldRender.map.createLayer("Boundaries", [grass2MiddleTileset, grassTiles2Tileset, pathDecorationsTileset].filter(t => t !== null), 0, 0);
  
      boundariesLayer?.setDepth(-2);
      const WaterMoundLayer = WorldRender.map.createLayer("Water_Mound", [WaterBridgeTileSet].filter(t => t !== null), 0, 0)
  
      const buildingsLayer = WorldRender.map.createLayer("Buildings", [WaterBridgeTileSet, castleTileset, grassTiles2Tileset, house52Tileset, house45Tileset, house43Tileset, house21Tileset, house13Tileset, house12Tileset, houseAbandoned14Tileset, tentBigTileset, blacksmithHouseTileset, cropsTileset, farmLandTileTileset, windmillTileset].filter(t => t !== null), 0, 0);
      
      WorldRender.map.createLayer("Farm", [cropsTileset, farmLandTileTileset, WaterTroughTileSet, HayTileSet].filter(t => t !== null), 0, 0);
  
  
      const fencesLayer = WorldRender.map.createLayer("Fences", [FencesTileSet].filter(t => t !== null), 0, 0)
      const tree1Layer = WorldRender.map.createLayer("Tree 1", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);
      const tree2Layer = WorldRender.map.createLayer("Tree 2", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset, foodSignageTileset].filter(t => t !== null), 0, 0);
      const tree3Layer = WorldRender.map.createLayer("Tree 3", [fruitTreeStagesTileset, mediumFruitTreeTileset, smallFruitTreeTileset].filter(t => t !== null), 0, 0);
  
  
  
      WorldRender.buildingsLayer = buildingsLayer ?? undefined;
      grassPathLayer?.setDepth(-3);
  
  
  
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









    Object.values(WorldRender.ANIMATION_CONFIGS).forEach(config => {
      AnimatedSprite.playAnimation(scene, config, config.x * scene.TILE_SIZE, config.y * scene.TILE_SIZE)
    })

    
    AnimatedSprite.addAnimation(scene, WorldRender.ANIMATION_WITHOUT_X_Y.grass);

    let length = WorldRender.ANIMATION_WITHOUT_X_Y.grass.x.length;




    for (let i = 0; i < length; i++) {

      let x_val = WorldRender.ANIMATION_WITHOUT_X_Y.grass.x[i]
      let y_val = WorldRender.ANIMATION_WITHOUT_X_Y.grass.y[i]

      AnimatedSprite.addSpriteAndPlayAnimation(scene, WorldRender.ANIMATION_WITHOUT_X_Y.grass, x_val , y_val )

      // AnimatedSprite.addSpriteAndPlayAnimation(this, WorldRender.ANIMATION_WITHOUT_X_Y.grass, 43 * this.TILE_SIZE, 17 * this.TILE_SIZE)

    }

    AnimatedSprite.addAnimation(scene, WorldRender.ANIMATION_WITHOUT_X_Y.flower_one);

    length = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x.length;
    for (let i = 0; i < length; i++) {
      let x_val = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.x[i]
      let y_val = WorldRender.ANIMATION_WITHOUT_X_Y.flower_one.y[i]
      AnimatedSprite.addSpriteAndPlayAnimation(scene, WorldRender.ANIMATION_WITHOUT_X_Y.flower_one, x_val , y_val )
    }










    

    }
    
  }
  