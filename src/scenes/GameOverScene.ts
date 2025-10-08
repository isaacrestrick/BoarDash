import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;
  private score: number = 0;

  constructor() {
    super('GameOverScene');
  }

  init(data: { score: number }) {
    this.score = data.score || 42;
  }

  preload() {
    this.load.image('grassy_background', '/grassy_background.png');

    this.load.spritesheet('knight-sprite', '/boar_knight/right/Knight-Idle-Right.png', { 
        frameWidth: (1584/6), 
        frameHeight: (1506/6)
      });
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.add.text(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        this.GRID_HEIGHT * this.TILE_SIZE / 5, 
        'congratulations adventurer (rip), a score of', 
        { 
          fontSize: '50px',
          color: '#ffffff',
        }
      ).setOrigin(0.5);
    this.add.text(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        this.GRID_HEIGHT * this.TILE_SIZE / 3, 
        `${this.score}`, 
        { 
          fontSize: '150px',
          fontStyle: 'bold',
          color: '#ffffff',

        }
      ).setOrigin(0.5);
      this.add.text(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        5 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 
        "has been assigned to these great deeds of yours.", 
        { 
          fontSize: '40px',
          fontStyle: 'bold',
          color: '#ffffff',

        }
      ).setOrigin(0.5);

    this.anims.create({ 
        key: 'knight-idle', 
        frames: this.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), 
        frameRate: 15, 
        repeat: -1 
    });

    const playerSprite = this.add.sprite(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        10 * this.GRID_HEIGHT * this.TILE_SIZE / 16, 
        'knight-sprite'
    );
    playerSprite.setScale(0.6);
    playerSprite.play('knight-idle');

    this.add.text(this.GRID_WIDTH * this.TILE_SIZE / 2, 8 * this.GRID_HEIGHT * this.TILE_SIZE / 10, 'Press Space to play again', { fontSize: '48px' }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
        this.scene.start('GameScene');
      });
  }


  update() {}
}