import Phaser from 'phaser';

export default class HelpScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  private tutorialMusic?: Phaser.Sound.BaseSound;
  constructor() {
    super('HelpScene');
  }

  preload() {
    this.load.image('tutorial_background', '/plain_background.png');
    this.load.audio('tutorial-screen', '/Audio/Tutorial.mp3');
  }

  create() {
    this.input.setDefaultCursor('url(/Cursor.png) 16 16, pointer');

    const playMusic = () => {
      if (this.tutorialMusic?.isPlaying) {
        return;
      }

      this.tutorialMusic = this.sound.add('tutorial-screen', { loop: false, volume: 0.6 });
      this.tutorialMusic.play();
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
      this.tutorialMusic?.stop();
      this.tutorialMusic?.destroy();
      this.tutorialMusic = undefined;
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
      'How To Play BoarDash',
      {
        fontSize: '72px',
        fontStyle: 'bold',
      }
    );

    titleLabel.text.setDepth(3);

    const instructionStartY = this.GRID_HEIGHT * this.TILE_SIZE / 5 + 40;
    const instructionSpacing = 130;
    const instructions = [
      'WASD to move, SPACE to sprint',
      'Hold H to attack, press J to pick up & drop off',
      'Pick up meals from the farmer, next to the Windmill',
      'Drop them off to villagers as indicated by their sign',
      'Finally give the king his burger',
      'Press SPACE to begin',
    ];

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