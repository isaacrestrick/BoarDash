import DialogueMessage from './DialogueMessage';

export default class DialogueManager {
  private scene: Phaser.Scene;
  private currentDialogueMessage?: DialogueMessage;
  private queue: string[] = [];
  private microDelay = 120; // Ms

  constructor(scene: Phaser.Scene, microDelay = 120) {
    this.scene = scene;
    this.microDelay = microDelay;
  }

  show(content: string) {
    if (this.currentDialogueMessage) {
      this.queue = [content];
      this.currentDialogueMessage.speedUp(6);
      return;
    }
    this.spawn(content);
  }

  enqueue(content: string) {
    this.queue.push(content);
    if (!this.currentDialogueMessage) this.checkNext();
  }

  private spawn(content: string) {
    this.currentDialogueMessage = new DialogueMessage(this.scene, content, undefined, () => {
      this.currentDialogueMessage = undefined;
      this.scene.time.delayedCall(this.microDelay, () => this.checkNext());
    });
  }

  private checkNext() {
    if (this.currentDialogueMessage || this.queue.length === 0) return;
    const next = this.queue.shift()!;
    this.spawn(next);
  }
}