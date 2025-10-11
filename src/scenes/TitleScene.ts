import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;
  private titleMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('grassy_background', '/title_card_background.png');

    this.load.spritesheet('knight-sprite', '/boar_knight/right/Knight-Idle-Right.png', { 
        frameWidth: (1584/6), 
        frameHeight: (1506/6)
      });

    this.load.audio('welcome-screen', '/Audio/Welcome-Screen.mp3');

    // Wait for font to load
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    const playMusic = () => {
      if (this.titleMusic?.isPlaying) {
        return;
      }

      this.titleMusic = this.sound.add('welcome-screen', { loop: false, volume: 0.6 });
      this.titleMusic.play();
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

    this.events.once('shutdown', () => {
      this.titleMusic?.stop();
      this.titleMusic?.destroy();
      this.titleMusic = undefined;
    });

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.titleMusic?.stop();
      this.titleMusic?.destroy();
      this.titleMusic = undefined;
    });

    const baseStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'Pixel Script',
      color: '#ffffff',
    };

    const fontPromise = document.fonts?.load
      ? Promise.all([
          document.fonts.load('64px "Pixel Script"'),
          document.fonts.load('48px "Pixel Script"'),
        ])
      : Promise.resolve();

    const createLabel = (x: number, y: number, message: string, fontSize: string, cornerRadius = 24) => {
      const paddingX = 32;
      const paddingY = 16;

      const text = this.add
        .text(x, y, message, {
          ...baseStyle,
          fontSize,
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

      text.setDepth(3);

      return { text, backgroundBox };
    };

    const drawTitleText = () => {
      createLabel(
        (this.GRID_WIDTH * this.TILE_SIZE) / 2,
        this.GRID_HEIGHT * this.TILE_SIZE / 5 - 100,
        'Welcome To The Amazing World Of',
        '64px'
      );

      createLabel(
        (this.GRID_WIDTH * this.TILE_SIZE) / 2,
        (8 * this.GRID_HEIGHT * this.TILE_SIZE) / 10,
        'Press SPACE to start',
        '48px'
      );

      createLabel(
        (this.GRID_WIDTH * this.TILE_SIZE) / 2,
        (9 * this.GRID_HEIGHT * this.TILE_SIZE) / 10,
        '(Or H for Help)',
        '48px'
      );
    };

    fontPromise.then(drawTitleText).catch(() => {
      console.warn('Pixel Script failed to load; using fallback font');
      drawTitleText();
    });


    this.anims.create({ 
	    key: 'knight-idle', 
	    frames: this.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), 
	    frameRate: 15, 
	    repeat: -1 
	});

    const playerSprite = this.add.sprite(
        this.GRID_WIDTH * this.TILE_SIZE / 2, 
        10 * this.GRID_HEIGHT * this.TILE_SIZE / 16 + 40, 
        'knight-sprite'
    );
    playerSprite.setScale(1);
    playerSprite.setDepth(2);
    playerSprite.play('knight-idle');

    

    this.input.keyboard?.on('keydown-SPACE', () => {
        this.scene.start('DDIAScene');
      });
    
    this.input.keyboard?.on('keydown-H', () => {
      this.scene.start('HelpScene');
    });
  }


  update() {}
}