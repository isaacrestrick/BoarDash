import Phaser from 'phaser'

export class HealthBar {
    private scene: Phaser.Scene;
    private health: number;
    private x: number;
    private y: number;
    private align: 'left' | 'right';
    private healthBarObject: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number = 20, y: number = 20, health: number, align: 'left' | 'right' = 'left') {
      this.scene = scene;
      this.health = health;
      this.x = x;
      this.y = y;
      this.align = align;
      this.createText(x, y, align);
    }
  
    createText(x: number, y: number, align: 'left' | 'right' = 'left'): void {

          const healthInfo = this.scene.add.text(x, y, '❤️ '.repeat(this.health), {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
          });

          healthInfo.setOrigin(align === 'right' ? 1 : 0, 0);
          this.healthBarObject = healthInfo
    }
  
    updateText(newHealth: number): void {  
        this.health = newHealth
        this.healthBarObject.setText('❤️ '.repeat(this.health));
    }

}