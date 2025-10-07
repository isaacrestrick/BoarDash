import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private npc!: Phaser.GameObjects.Sprite;
  private vampire!: Phaser.GameObjects.Sprite;
  private vampire_two!: Phaser.GameObjects.Sprite;
  private cursors!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 30;
  private readonly GRID_HEIGHT = 22;
  private readonly MOVE_SPEED = 200;
  private wasNearNpc = false
  private wasNearNpcTwo = false
  private lastDir : string = "";


  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('grassy_background', 'grassy_background.png');
    this.load.image('boar_knight_down', 'boar_knight_sprite/boar_knight_down.png');
    this.load.image('boar_knight_up', 'boar_knight_sprite/boar_knight_up.png');
    this.load.image('boar_knight_left', 'boar_knight_sprite/boar_knight_left.png');
    this.load.image('boar_knight_right', 'boar_knight_sprite/boar_knight_right.png');
    this.load.spritesheet('farmer-sprite', "farmer-sprite.png", {
      frameWidth: 250,
      frameHeight: 250
    })

    this.load.spritesheet('knight-sprite', "knight-sprite.png", {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet("vampire-idle", "Vampires1/Idle/Vampires1_Idle_full.png", {
      frameWidth: 64, 
      frameHeight: 64
    })

    this.load.spritesheet("vampire-death", "Vampires1/Death/Vampires1_Death_full.png", {
      frameWidth: 64, 
      frameHeight: 64
    })
  }

  create() {

    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);


    this.player = this.add.sprite(100, 100, 'knight-sprite');
    this.player.setScale(4.5)
    this.player.setDepth(10); // Knight always on top
    this.anims.create({
      key: "knight-idle",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 0, end: 3}),
      frameRate: 3,
      repeat: -1
    })

    this.anims.create({
      key: "knight-right",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 10, end: 17}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-up",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 20, end: 27}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-left",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 30, end: 37}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-down",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 40, end: 47}),
      frameRate: 8,
      repeat: 1
    })


    this.anims.create({
      key: "knight-attack-right",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 160, end: 165}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-attack-up",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 170, end: 175}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-attack-left",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 180, end: 185}),
      frameRate: 8,
      repeat: 1
    })

    this.anims.create({
      key: "knight-attack-down",
      frames: this.anims.generateFrameNumbers("knight-sprite", {start: 190, end: 195}),
      frameRate: 8,
      repeat: 1
    })



    this.vampire = this.add.sprite(
      700, 
      300,
      "vampire-idle"
    )
    this.vampire.setScale(2.5)

    this.vampire_two = this.add.sprite(
      300, 
      300,
      "vampire-idle"
    )
    this.vampire_two.setScale(2.5)

    this.anims.create({
      key: "vampire-idle",
      frames: this.anims.generateFrameNames("vampire-idle", { start: 0, end: 3}),
      frameRate: 8,
      repeat: -1,
    })
    this.anims.create({
      key: "vampire-death", 
      frames: this.anims.generateFrameNames("vampire-death", {start: 0, end:9}),
      frameRate: 8,
      repeat: 0
    })

    this.vampire.play("vampire-idle", true);

    this.vampire_two.play("vampire-idle", true);
    







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

    const hKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    let lastDir = this.lastDir || 'down';

    if (this.cursors.W.isDown) {
      velocityY = -this.MOVE_SPEED;
      lastDir = 'up';
      this.player.play(hKey.isDown ? 'knight-attack-up' : 'knight-up', true);
    } else if (this.cursors.S.isDown) {
      velocityY = this.MOVE_SPEED;
      lastDir = 'down';
      this.player.play(hKey.isDown ? 'knight-attack-down' : 'knight-down', true);
    }

    if (this.cursors.A.isDown) {
      velocityX = -this.MOVE_SPEED;
      lastDir = 'left';
      this.player.play(hKey.isDown ? 'knight-attack-left' : 'knight-left', true);
    } else if (this.cursors.D.isDown) {
      velocityX = this.MOVE_SPEED;
      lastDir = 'right';
      this.player.play(hKey.isDown ? 'knight-attack-right' : 'knight-right', true);
    }

    this.lastDir = lastDir;

    // Only play idle if not moving
    if (velocityX === 0 && velocityY === 0) {
      if (hKey.isDown) {
        this.player.play('knight-attack-' + lastDir, true);
      } else {
        this.player.play('knight-idle', true);
      }
    }

    if (hKey.isDown && this.wasNearNpc ) {
      this.vampire.play("vampire-death", true);
      this.vampire.once('animationcomplete', () => this.vampire.setVisible(false));
    } 


    if (hKey.isDown && this.wasNearNpcTwo) {
      this.vampire_two.play("vampire-death", true);
      this.vampire_two.once('animationcomplete', () => this.vampire_two.setVisible(false));
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

    let dx = this.player.x - this.vampire.x;
    let dy = this.player.y - this.vampire.y;
    let dist = Math.hypot(dx, dy);
    let threshold = 2 * this.TILE_SIZE;

    let isNear = dist <= threshold;
    if (isNear && !this.wasNearNpc) {
      console.log('contact');
    }
    this.wasNearNpc = isNear


    dx = this.player.x - this.vampire_two.x;
    dy = this.player.y - this.vampire_two.y;
    dist = Math.hypot(dx, dy);
    threshold = 2 * this.TILE_SIZE;

    isNear = dist <= threshold;
    this.wasNearNpcTwo = isNear
  }
}