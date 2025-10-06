import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
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

  create() {
    // Draw grid
    const graphics = this.add.graphics();
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
    }

    // Create player
    this.player = this.add.rectangle(
      this.TILE_SIZE * 10,
      this.TILE_SIZE * 7,
      this.TILE_SIZE - 4,
      this.TILE_SIZE - 4,
      0x00ff00
    );

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
    } else if (this.cursors.S.isDown) {
      velocityY = this.MOVE_SPEED;
    }

    if (this.cursors.A.isDown) {
      velocityX = -this.MOVE_SPEED;
    } else if (this.cursors.D.isDown) {
      velocityX = this.MOVE_SPEED;
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