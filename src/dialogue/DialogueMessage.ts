import Phaser from 'phaser';

export type DialogueDone = () => void;

export default class DialogueMessage {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;
  private enterTween?: Phaser.Tweens.Tween;
  private exitTween?: Phaser.Tweens.Tween;
  private onDone?: DialogueDone;

  constructor(
    scene: Phaser.Scene,
    content: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    onDone?: DialogueDone
  ) {
    this.scene = scene;
    this.onDone = onDone;
    const [x, y] =  [scene.scale.width / 2, scene.scale.height - 100]
    this.text = this.scene.add.text(x, y, content, style).setOrigin(0.5);
    this.text.alpha = 0;

    this.animate();
  }

  private animate() {
    this.enterTween = this.scene.tweens.add({
      targets: this.text,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
      onComplete: () => this.startExit(800)
    });
  }

  private startExit(delayMs: number) {
    this.exitTween = this.scene.tweens.add({
      targets: this.text,
      //y: this.text.y - 50,
      alpha: 0,
      delay: delayMs,
      duration: 600,
      ease: 'Power2',//ease: 'Cubic.easeOut',
      onComplete: () => {
        this.text.destroy();
        this.onDone?.();
      }
    });
  }

  // Speed up animation when a new message arrives
  public speedUp(fastDurationMs = 120) {
    this.enterTween?.remove();
    this.exitTween?.remove();

    this.exitTween = this.scene.tweens.add({
      targets: this.text,
      //y: this.text.y - 20,
      alpha: 0,
      duration: fastDurationMs,
      ease: 'Linear',
      onComplete: () => {
        this.text.destroy();
        this.onDone?.();
      }
    });
  }
}
