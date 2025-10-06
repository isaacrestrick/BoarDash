import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private npc!: Phaser.GameObjects.Rectangle;
  private cursors!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 20;
  private readonly GRID_HEIGHT = 15;
  private readonly MOVE_SPEED = 200;
  private wasNearNpc = false

  constructor() {
    super('GameScene');
  }

  preload() {

    this.load.image('grassy_background', 'grassy_background.png');
    
    this.load.image('boar_knight_down', 'boar_knight_sprite/boar_knight_down.png');
    this.load.image('boar_knight_up', 'boar_knight_sprite/boar_knight_up.png');
    this.load.image('boar_knight_left', 'boar_knight_sprite/boar_knight_left.png');
    this.load.image('boar_knight_right', 'boar_knight_sprite/boar_knight_right.png');
  }

  create() {

    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);


    /*const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333333, 1);

    for (let x = 0; x <= this.GRID_WIDTH; x++) {
      graphics.lineBetween(
        x * this.TILE_SIZE,
        0,
        x * this.TILE_SIZE,
        this.GRID_HEIGHT * this.TILE_SIZE
      );
    }

    for (let y = 0; y <= this.GRID_HEIGHT; y++) {
      graphics.lineBetween(
        0,
        y * this.TILE_SIZE,
        this.GRID_WIDTH * this.TILE_SIZE,
        y * this.TILE_SIZE
      );
    }*/

    this.player = this.add.sprite(100, 100, 'boar_knight_down');
    this.player.setScale(0.2); // Make sprite smaller

    // Create NPC
    this.npc = this.add.rectangle(
      this.TILE_SIZE * 15,
      this.TILE_SIZE * 7,
      this.TILE_SIZE - 4,
      this.TILE_SIZE - 4,
      0x0000ff
    );

    // Setup WASD controls
    this.cursors = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  update() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.W.isDown) {
      velocityY = -this.MOVE_SPEED;
      this.player.setTexture('boar_knight_up');
    } else if (this.cursors.S.isDown) {
      velocityY = this.MOVE_SPEED;
      this.player.setTexture('boar_knight_down');
    }

    if (this.cursors.A.isDown) {
      velocityX = -this.MOVE_SPEED;
      this.player.setTexture('boar_knight_left');
    } else if (this.cursors.D.isDown) {
      velocityX = this.MOVE_SPEED;
      this.player.setTexture('boar_knight_right');
    }

    // Update player position
    this.player.x += velocityX * (this.game.loop.delta / 1000);
    this.player.y += velocityY * (this.game.loop.delta / 1000);

    // Keep player in bounds
    const halfSize = (this.TILE_SIZE - 4) / 2;
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      halfSize,
      this.GRID_WIDTH * this.TILE_SIZE - halfSize
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      halfSize,
      this.GRID_HEIGHT * this.TILE_SIZE - halfSize
    );

    const dx = this.player.x - this.npc.x;
    const dy = this.player.y - this.npc.y;
    const dist = Math.hypot(dx, dy);
    const threshold = this.TILE_SIZE;

    const isNear = dist <= threshold;
    if (isNear && !this.wasNearNpc) {
      console.log('contact');
    }
    this.wasNearNpc = isNear
  }
}