import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;
  private score: number = 0;
  private win: boolean;
  private gameOverMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super('GameOverScene');
  }

  init(data: { score: number, win: boolean }) {
    this.score = data.score === undefined ? 42 : data.score;
    this.win = data.win;
  }

  preload() {
    this.load.image('tutorial_background', '/plain_background.png');

    this.load.spritesheet('knight-sprite', '/boar_knight/right/Knight-Idle-Right.png', { 
        frameWidth: (1584/6), 
        frameHeight: (1506/6)
      });

    this.load.audio('gameover-win', '/Audio/Win.mp3');
    this.load.audio('gameover-lose', '/Audio/Lose.mp3');
  }

  create() {
    const playMusic = () => {
      if (this.gameOverMusic?.isPlaying) {
        return;
      }

      const trackKey = this.win ? 'gameover-win' : 'gameover-lose';
      this.gameOverMusic = this.sound.add(trackKey, { loop: false, volume: 0.6 });
      this.gameOverMusic.play();
    };

    if (this.sound.locked) {
      const unlockAndPlay = () => {
        playMusic();
        this.input.off(Phaser.Input.Events.POINTERDOWN, pointerHandler);
        this.input.keyboard?.off('keydown', keyHandler);
      };

      const pointerHandler = () => unlockAndPlay();
      const keyHandler = () => unlockAndPlay();

      this.sound.once(Phaser.Sound.Events.UNLOCKED, unlockAndPlay);
      this.input.once(Phaser.Input.Events.POINTERDOWN, pointerHandler);
      this.input.keyboard?.once('keydown', keyHandler);
    } else {
      playMusic();
    }

    const cleanup = () => {
      this.gameOverMusic?.stop();
      this.gameOverMusic?.destroy();
      this.gameOverMusic = undefined;
    };

    this.events.once('shutdown', cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);

    const background = this.add.image(0, 0, 'tutorial_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    const baseStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Pixel Script',
      color: '#ffffff',
    };

    const contentStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      ...baseStyle,
      fontSize: '48px',
    };

    const createLabel = (
      x: number,
      y: number,
      message: string,
      options?: Partial<Phaser.Types.GameObjects.Text.TextStyle>,
      cornerRadius = 24
    ) => {
      const paddingX = 32;
      const paddingY = 16;

      const text = this.add
        .text(x, y, message, {
          ...contentStyle,
          ...options,
        })
        .setOrigin(0.5)
        .setDepth(3);

      const bounds = text.getBounds();
      const rectX = bounds.centerX - bounds.width / 2 - paddingX;
      const rectY = bounds.centerY - bounds.height / 2 - paddingY;
      const rectWidth = bounds.width + paddingX * 2;
      const rectHeight = bounds.height + paddingY * 2;

      const backgroundBox = this.add.graphics();
      backgroundBox.fillStyle(0x444444, 0.7);
      backgroundBox.fillRoundedRect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
      backgroundBox.setDepth(1);

      return { text, backgroundBox };
    };

    const titleY = (this.GRID_HEIGHT * this.TILE_SIZE) / 5 - 60;
    const contentSpacing = 170;
    const subtitleY = titleY + contentSpacing;
    const scoreY = subtitleY + contentSpacing;
    const noteY = scoreY + contentSpacing;

    const titleMessage = this.win ? 'Victory!' : 'Game Over';
    const subtitleMessage = this.win
      ? 'Your deeds echo throughout the kingdom'
      : 'The villagers mourn this day';

    createLabel((this.GRID_WIDTH * this.TILE_SIZE) / 2, titleY, titleMessage, {
      fontSize: '96px',
      fontStyle: 'bold',
    });

    createLabel((this.GRID_WIDTH * this.TILE_SIZE) / 2, subtitleY, subtitleMessage, {
      fontSize: '56px',
    });

    createLabel((this.GRID_WIDTH * this.TILE_SIZE) / 2, scoreY, `Final Score: ${this.score}`, {
      fontSize: '96px',
      fontStyle: 'bold',
    });

    const noteMessage = this.win
      ? 'The king feasts tonight in your honor.'
      : 'Rest and return stronger for the king.';

    createLabel((this.GRID_WIDTH * this.TILE_SIZE) / 2, noteY, noteMessage, {
      fontSize: '48px',
    });

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

    createLabel(
      (this.GRID_WIDTH * this.TILE_SIZE) / 2,
      (8 * this.GRID_HEIGHT * this.TILE_SIZE) / 10,
      'Press SPACE to play again',
      {
        fontSize: '48px',
      },
      32
    );

    this.input.keyboard?.on('keydown-SPACE', () => {
        this.scene.start('GameScene');
      });
  }


  update() {}
}