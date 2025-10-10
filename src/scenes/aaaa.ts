// HelpScene.ts
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

  // micro-loop state (help area)
  private helpHasFood = false;
  private fedVillagers = 0;
  private canGiveBurger = false;
  private lastSkeletonDeath = 0;

  constructor() { super('HelpScene'); }

  preload() {
    // Use the SAME path as GameScene to avoid cache weirdness
    this.load.image('grassy_background', 'grassy_background.png');

    Player.getRequiredAssets().forEach(a => {
      if (a.type === 'spritesheet') this.load.spritesheet(a.key, a.path, { frameWidth: a.frameWidth!, frameHeight: a.frameHeight! });
      else if (a.type === 'image') this.load.image(a.key, a.path);
    });
    Skeleton.getRequiredAssets().forEach(a => this.load.spritesheet(a.key, a.path, { frameWidth: a.frameWidth!, frameHeight: a.frameHeight! }));
    King.getRequiredAssets().forEach(a => this.load.spritesheet(a.key, a.path, { frameWidth: a.frameWidth!, frameHeight: a.frameHeight! }));
    Farmer.getRequiredAssets().forEach(a => this.load.spritesheet(a.key, a.path, { frameWidth: a.frameWidth!, frameHeight: a.frameHeight! }));
    Villager.getRequiredAssets().forEach(a => this.load.spritesheet(a.key, a.path, { frameWidth: a.frameWidth!, frameHeight: a.frameHeight! }));
  }

  create() {
    const W = this.GRID_WIDTH * this.TILE_SIZE;
    const H = this.GRID_HEIGHT * this.TILE_SIZE;

    // Background
    this.add.image(0, 0, 'grassy_background').setOrigin(0, 0).setDisplaySize(W, H).setScrollFactor(0);

    // --- MICRO DEMO STRIP (top 30% of screen) ---
    const stripY = H * 0.16;         // vertical line for the row
    const leftX = W * 0.10;
    const gap = W * 0.13;

    // Minimal config for the help demo
    const villagerConfigs: Array<VillagerConfig> = [
      {
        food: "Turkey Sandwich 🥪",
        title: "Sandwich Fan",
        greetingDialogue: "Hi!",
        failureDialogue: "Still hungry…",
        successDialogue: "Yum!",
        key: 'villager-mary-idle'
      },
      {
        food: "Turkey Sandwich 🥪",
        title: "Hungry Villager",
        greetingDialogue: "Hello!",
        failureDialogue: "Where’s the food?",
        successDialogue: "Thanks!",
        key: 'villager-katy-idle'
      }
    ];

    // Order: Farmer | Skeleton | Player | Villager A | Villager B | King
    this.farmer = new Farmer(this, leftX, stripY, 2.5 / 3.333, {
      key: 'farmer-idle',
      greetingDialogue: "Press J near me to pick up.",
      foods: ["Turkey Sandwich 🥪", "Kingly Burger 🍔"],
      foodSingulars: { "Turkey Sandwich 🥪": "Turkey Sandwich 🥪", "Kingly Burger 🍔": "Kingly Burger 🍔" }
    });

    // Spawn one skeleton, respawn later on death
    this.skeletons = [ new Skeleton(this, leftX + gap, stripY, 3.5 / 3.333) ];

    this.player = new Player(this, leftX + gap * 2, stripY);

    this.villagers = [
      new Villager(this, leftX + gap * 3, stripY, 2.5 / 3.333, villagerConfigs[0]),
      new Villager(this, leftX + gap * 4, stripY, 2.5 / 3.333, villagerConfigs[1]),
    ];

    this.king = new King(this, leftX + gap * 5, stripY, 2.5 / 3.333);

    // --- INSTRUCTIONS (bottom) ---
    const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontSize: '64px', color: '#ffffff' };
    const lineStyle:  Phaser.Types.GameObjects.Text.TextStyle = { fontSize: '48px', color: '#ffffff', wordWrap: { width: W * 0.9 } };

    this.add.text(W/2, H*0.48, 'How 2 Play BoarDash', titleStyle).setOrigin(0.5).setScrollFactor(0);
    this.add.text(W/2, H*0.55, '___________________________________________', { fontSize: '48px' }).setOrigin(0.5).setScrollFactor(0);

    const lines = [
      'WASD to move, Space to sprint',
      'Hold H to attack, press J to pick up & drop off',
      'Pick up meals from the farmer',
      'Drop them off to the villagers',
      'Then give the king his burger',
      'Press Space to begin'
    ];
    lines.forEach((t, i) => this.add.text(W/2, H*(0.63 + i*0.06), t, lineStyle).setOrigin(0.5).setScrollFactor(0));

    // Start game
    this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }

  update(time: number) {
    // Basic player update (movement/attack state)
    this.player.update();

    const px = this.player.getX();
    const py = this.player.getY();

    // --- Skeleton simple follow & attack demo ---
    this.skeletons.forEach(s => {
      s.updateFollow(px, py, 40); // slow follow
      if (s.triggerAttack(px, py)) {
        // light damage & knockback demo (optional)
        this.player.damageReceived();
      }
      // If player is attacking and near skeleton => kill it
      if (this.player.isAttacking() && s.isPlayerNear()) {
        s.triggerDeath();
        this.lastSkeletonDeath = time;
      }
    });

    // Respawn skeleton ~ every 4s after last death (keep one on screen)
    if (this.skeletons.length === 0 && time - this.lastSkeletonDeath > 4000) {
      const leftX = this.GRID_WIDTH * this.TILE_SIZE * 0.10;
      const stripY = this.GRID_HEIGHT * this.TILE_SIZE * 0.16;
      this.skeletons.push(new Skeleton(this, leftX + (this.GRID_WIDTH * this.TILE_SIZE * 0.13), stripY, 3.5 / 3.333));
    }

    // --- Pick up / deliver demo on J ---
    if (this.player.justPressedFoodKey()) {
      // Near farmer: pick up sandwich if empty; if villagers fed -> grant burger
      if (this.farmer.isPlayerNear()) {
        if (!this.helpHasFood && !this.canGiveBurger) {
          this.helpHasFood = true; // holding "Turkey Sandwich 🥪"
          this.events.emit("dialogue:show", "Picked up a Turkey Sandwich 🥪");
        } else if (!this.helpHasFood && this.canGiveBurger) {
          this.helpHasFood = true; // holding "Kingly Burger 🍔"
          this.events.emit("dialogue:show", "Picked up a Kingly Burger 🍔");
        }
      }

      // Deliver to villagers if holding sandwich
      if (this.helpHasFood && !this.canGiveBurger) {
        this.villagers.forEach(v => {
          if (v.isPlayerNear()) {
            v.triggerDelivery();
            this.helpHasFood = false;
            this.fedVillagers++;
            this.events.emit("dialogue:show", "Delivered 🥪");
          }
        });
        if (this.fedVillagers >= 2) {
          this.canGiveBurger = true;
          this.events.emit("dialogue:show", "Villagers fed! Burger unlocked 🍔");
        }
      }

      // Deliver to king if holding burger
      if (this.helpHasFood && this.canGiveBurger && this.king.isPlayerNear()) {
        this.king.triggerDelivery();
        this.helpHasFood = false;
        this.events.emit("dialogue:show", "Gave the King his Burger 👑🍔");
      }
    }
  }
}
