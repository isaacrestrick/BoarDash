import Phaser from 'phaser';

import { Player } from '../Player';
import { Farmer } from '../npcs/Farmer';
import { King } from '../npcs/King';
import { Villager, type VillagerConfig } from '../npcs/Villager'
import { Skeleton } from '../npcs/Skeleton';



export default class HelpScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  private player!: Player;
  private king!: King;
  private villagers!: Villager[];
  public skeletons!: Skeleton[];

  private farmer!: Farmer;


  constructor() {
    super('HelpScene');
  }

  preload() {
    this.load.image('grassy_background', '/grassy_background.png');

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

    Farmer.getRequiredAssets().forEach(asset => {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });

    Villager.getRequiredAssets().forEach(asset => {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });
  
  }

  create() {
    this.player = new Player(this, 36 * this.TILE_SIZE, 19 * this.TILE_SIZE)//720, 528); // 35 18
    this.skeletons = []



    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.add.text(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        0.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 
        'How 2 Play BoarDash', 
        { 
          fontSize: '64px',
          color: '#ffffff'
        }
      ).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 3.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, '___________________________________________', { fontSize: '48px' }).setOrigin(0.5);


    this.add.text(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        4.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 
        'WASD to move, Space to sprint', 
        { 
          fontSize: '48px',
          wordWrap: { width: this.GRID_WIDTH * this.TILE_SIZE * 0.9 } 
        }
      ).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 4.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, '', { fontSize: '48px' }).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 5.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Hold H to attack, press J to pick up & drop off', { fontSize: '48px' }).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 6.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Pick up meals from the farmer', { fontSize: '48px' }).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 7.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Drop them off to all the villagers', { fontSize: '48px' }).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 8.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Then give the king his burger', { fontSize: '48px' }).setOrigin(0.5);

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 9.5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Press Space to begin', { fontSize: '48px' }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
        this.scene.start('GameScene');
      });
    
  }


  update() {}
}