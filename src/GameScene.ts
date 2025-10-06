import Phaser from 'phaser';
import { Player } from './Player';
import { NPC } from './NPC';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private npc!: NPC;
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;
  private readonly GRID_HEIGHT = 22;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('grassy_background', 'grassy_background.png');

    const playerAssets = Player.getRequiredAssets();
    playerAssets.forEach(asset => {
      if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.player = new Player(this, 100, 100);
    this.npc = new NPC(this, this.TILE_SIZE * 15, this.TILE_SIZE * 7);
  }

  update() {
    this.player.update();
    this.npc.checkPlayerInteraction(this.player.getX(), this.player.getY());
  }
}