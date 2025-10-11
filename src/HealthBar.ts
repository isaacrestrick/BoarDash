import Phaser from 'phaser'

export class HealthBar {
    private scene: Phaser.Scene;
    private health: number;
    private x: number;
    private y: number;
    private align: 'left' | 'right';
    private container: Phaser.GameObjects.Container;
    private hearts: Phaser.GameObjects.Image[] = [];
    private heartScale = 0.6;
    private heartPadding = 4;
    private heartWidth = 0;

    constructor(scene: Phaser.Scene, x: number = 20, y: number = 20, health: number, align: 'left' | 'right' = 'left') {
      this.scene = scene;
      this.health = health;
      this.x = x;
      this.y = y;
      this.align = align;
      this.container = this.scene.add.container(x, y);
      this.container.setName('health-bar');
      this.container.setData('type', 'health-bar');
      this.syncHearts();
    }

    private syncHearts(): void {
      while (this.hearts.length < this.health) {
        const heart = this.scene.add.image(0, 0, 'ui-heart');
        heart.setOrigin(0, 0);
        heart.setScale(this.heartScale);
        if (!this.heartWidth) {
          this.heartWidth = heart.displayWidth;
        }
        this.container.add(heart);
        this.hearts.push(heart);
      }

      this.hearts.forEach((heart, index) => {
        const visible = index < this.health;
        heart.setVisible(visible);
        if (visible) {
          heart.setPosition(index * (this.heartWidth + this.heartPadding), 0);
        }
      });

      this.layout();
    }

    updateText(newHealth: number): void {
      this.health = newHealth;
      this.syncHearts();
    }

    private layout(): void {
      const activeHearts = this.hearts.filter(heart => heart.visible);
      const totalWidth = activeHearts.length === 0
        ? 0
        : (activeHearts.length - 1) * (this.heartWidth + this.heartPadding) + this.heartWidth;

      const alignedX = this.align === 'right' ? this.x - totalWidth : this.x;
      this.container.setPosition(alignedX, this.y);
    }
}