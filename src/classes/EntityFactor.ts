

import { Skeleton } from '../npcs/Skeleton';
import { King } from '../npcs/King';
import { SecondKing } from '../npcs/SecondKing';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Farmer } from '../npcs/Farmer';
import { Claude } from '../npcs/Claude';
import { MageSkeleton } from '../npcs/MageSkeleton';
import { WorldRender } from '../scenes/WorldRender';

export class EntityFactory {

    public static readonly EntityType = {
      SKELETON: 'skeleton',
      MAGE_SKELETON: 'mage_skeleton',
      KING: 'king',
      VILLAGER: 'villager',
      FARMER: 'farmer', 
      SECONDKING: 'secondking'
    };
  
    private static registry = new Map<string, any>([
      [EntityFactory.EntityType.SKELETON, Skeleton],
      [EntityFactory.EntityType.MAGE_SKELETON, MageSkeleton],
      [EntityFactory.EntityType.KING, King],
      [EntityFactory.EntityType.VILLAGER, Villager],
      [EntityFactory.EntityType.FARMER, Farmer],
      [EntityFactory.EntityType.SECONDKING, SecondKing],
      // Claude uses images, not spritesheets - handled separately in preloadAll
  
    ]);
  
  
    static preloadAll(scene: GameScene) : void {
      for (const [_, EntityClass] of this.registry) {
        EntityClass.getRequiredAssets().forEach(asset=> {
          scene.load.spritesheet(asset.key, asset.path, {
            frameWidth: asset.frameWidth,
            frameHeight: asset.frameHeight
          });
        });
      }
      Claude.getRequiredAssets().forEach(asset => {
        scene.load.image(asset.key, asset.path);
      });
    }
  
    static renderNPCs(scene: GameScene) : void {
  
      const { villagerConfigs, foods, titles, farmerConfig }: { villagerConfigs: Array<VillagerConfig>, foods, titles, farmerConfig} = WorldRender.loadConfigsAndDialogues();
  
  
      scene.farmer = new Farmer(scene, 34 * scene.TILE_SIZE + 6, 17 * scene.TILE_SIZE + 10, 2.5 / 3.333, farmerConfig);
      scene.king = new King(scene, 3 * scene.TILE_SIZE + 6, 28 * scene.TILE_SIZE + 10, 2.5 / 3.333);
  
      scene.villagers = [
        //new Villager(this, 20 * this.TILE_SIZE, 19 * this.TILE_SIZE, 2.5 / 3.333),
        new Villager(scene, 38 * scene.TILE_SIZE, 29 * scene.TILE_SIZE, 2.5 / 3.333, 0, villagerConfigs[3]), //
        new Villager(scene, 6 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 1, villagerConfigs[2]), //
        new Villager(scene, 15 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 2), //
        new Villager(scene, 5 * scene.TILE_SIZE, 17 * scene.TILE_SIZE, 2.5 / 3.333, 3, villagerConfigs[3]), //
        //new Villager(scene, 6 * scene.TILE_SIZE, 13 * scene.TILE_SIZE, 2.5 / 3.333),
      
        new Villager(scene, 16 * scene.TILE_SIZE, 15 * scene.TILE_SIZE, 2.5 / 3.333, 4, villagerConfigs[2]), //
        new Villager(scene, 21 * scene.TILE_SIZE, 19 * scene.TILE_SIZE, 2.5 / 3.333, 5, villagerConfigs[0]), //
        new Villager(scene, 52 * scene.TILE_SIZE, 26 * scene.TILE_SIZE, 2.5 / 3.333, 6, villagerConfigs[0]), //
        new Villager(scene, 55 * scene.TILE_SIZE, 21 * scene.TILE_SIZE, 2.5 / 3.333, 7, villagerConfigs[2]), //
        new Villager(scene, 71 * scene.TILE_SIZE, 22 * scene.TILE_SIZE, 2.5 / 3.333, 8, villagerConfigs[1]), //
        new Villager(scene, 47 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 9, villagerConfigs[1]),
        new Villager(scene, 52 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 10, villagerConfigs[4]),
        new Villager(scene, 58 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 11, villagerConfigs[2]),
        new Villager(scene, 67 * scene.TILE_SIZE, 5 * scene.TILE_SIZE, 2.5 / 3.333, 12),
        new Villager(scene, 73 * scene.TILE_SIZE, 7 * scene.TILE_SIZE, 2.5 / 3.333, 13, villagerConfigs[3]),
      ]
  
      scene.king = new King(scene, 5 * scene.TILE_SIZE, 29 * scene.TILE_SIZE, 2.5 / 3.333);
      scene.secondKing = new SecondKing(scene, 79 * scene.TILE_SIZE, 24 * scene.TILE_SIZE, 2.5 / 3.3333)
  
      scene.claude = new Claude(scene, 78 * scene.TILE_SIZE, 10 * scene.TILE_SIZE, 2.5 / 100.333);
  
    }
  
    static getVillagersLength() : 14 {
      return 14
    }
  }
  