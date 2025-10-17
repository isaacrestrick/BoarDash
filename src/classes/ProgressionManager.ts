import { AudioManager } from "./AudioManager";
export class ProgressionManager {

    private static instance: ProgressionManager;
  
    private deliveredMealCount = 0;
    private audioFlags = {
      three: false, six: false
    }
  
    private constructor(private scene: Phaser.Scene) {  }
  
    
  
    public handleMealDelivered(): void {
      this.deliveredMealCount++;
  
      if (this.deliveredMealCount >= 3 && !this.audioFlags.three) {
        this.audioFlags.three = true;
        AudioManager.playSound(this.scene, this.scene.deliveryThreeSound);
      }
  
      if (this.deliveredMealCount >= 6 && !this.audioFlags.six) {
        this.audioFlags.six = true;
        AudioManager.playSound(this.scene, this.scene.deliverySixSound);
      }
    }
  
    static getInstance(scene?: Phaser.Scene): ProgressionManager {
      if (!ProgressionManager.instance && scene) {
        this.instance = new ProgressionManager(scene);
      }
      return ProgressionManager.instance;
    }
  }
  
  