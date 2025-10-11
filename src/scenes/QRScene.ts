import Phaser from 'phaser';

export default class QRScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  private qrMusic?: Phaser.Sound.BaseSound;
  constructor() {
    super('QRScene');
  }

  preload() {
    this.load.image('tutorial_background', '/plain_background.png');
    this.load.image('qr', '/QR.png');
    this.load.audio('QR-screen', '/Audio/QR.mp3');
  }

  create() {
    this.input.setDefaultCursor('url(/Cursor.png) 16 16, pointer');

    const playMusic = () => {
      if (this.qrMusic?.isPlaying) {
        return;
      }

      this.sound.stopAll();
      this.qrMusic = this.sound.add('QR-screen', { loop: false, volume: 0.6 });
      this.qrMusic.play();
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
      this.qrMusic?.stop();
      this.qrMusic?.destroy();
      this.qrMusic = undefined;
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
      backgroundBox.fillStyle(0x444444, 0.5);
      backgroundBox.fillRoundedRect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
      backgroundBox.setDepth(1);

      return { text, backgroundBox };
    };

    const titleLabel = createLabel(
      (this.GRID_WIDTH * this.TILE_SIZE) / 2,
      this.GRID_HEIGHT * this.TILE_SIZE / 5 - 100,
      'Play BoarDash Here:',
      {
        fontSize: '72px',
        fontStyle: 'bold',
      }
    );

    titleLabel.text.setDepth(3);

    const qrImage = this.add.image(
      (this.GRID_WIDTH * this.TILE_SIZE) / 2,
      (this.GRID_HEIGHT * this.TILE_SIZE) / 2,
      'qr'
    );
    qrImage.setOrigin(0.5);
    qrImage.setDepth(2);

    qrImage.setScale(0.20); 

    const instructionStartY = 5 * (this.GRID_HEIGHT * this.TILE_SIZE) / 6 + 40;
    const instructionSpacing = 130;
    const instructions = ['Press SPACE to begin'];

    instructions.forEach((message, index) => {
      createLabel(
        (this.GRID_WIDTH * this.TILE_SIZE) / 2,
        instructionStartY + index * instructionSpacing,
        message
      );
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.scene.start('DDIAScene');
    });
    
  }


  update() {}
}