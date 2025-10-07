import Phaser from 'phaser';

export default class DialogueMessage {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    content: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)',
    }
  ) {
    this.scene = scene;
    const [x, y] =  [scene.scale.width / 2, scene.scale.height - 100]
    this.text = this.scene.add.text(x, y, content, style).setOrigin(0.5);
    this.text.alpha = 0; // start invisible

    this.animate();
  }

  private animate() {
    this.scene.tweens.add({
      targets: this.text,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.text,
          y: this.text.y - 50,
          alpha: 0,
          delay: 800,       
          duration: 600,
          ease: 'Cubic.easeOut',
          onComplete: () => this.text.destroy()
        });
      }
    });
  }
}
