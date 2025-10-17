export class AudioManager {
    private static instance: AudioManager;
    private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
    
    // 'this.scene' is not registered because 'scene' is not a static property of AudioManager,
    // and static methods/properties cannot access instance variables like 'this.scene'.
    // In static context, 'this' refers to the class itself, not an instance.
    // Instead, pass the Phaser.Scene as an argument to the static method:
  
    private constructor(private scene: Phaser.Scene) {}
  
    static loadAudio(scene: Phaser.Scene) {
      scene.load.audio('delivery-three', '/Audio/hungry.mp3');
      scene.load.audio('delivery-six', '/Audio/Success-2.mp3');
      scene.load.audio('delivery-twelve', '/Audio/Success-2.mp3');
      scene.load.audio('delivery-meals', '/Audio/meals.mp3');
  
      scene.load.audio('horde-activated', '/Audio/Horde.mp3');
      scene.load.audio('claude-b2b', '/Audio/b2b.mp3');
  
  
  
    }
  
    static createSounds(scene: Phaser.Scene) {
      scene.deliveryThreeSound = scene.sound.add('delivery-three', { loop: false, volume: 0.7 });
      scene.deliverySixSound = scene.sound.add('delivery-six', { loop: false, volume: 0.7 });
      scene.deliveryTwelveSound = scene.sound.add('delivery-twelve', { loop: false, volume: 0.7 });
      scene.mealsSound = scene.sound.add('delivery-meals', { loop: false, volume: 0.7 });
      scene.hordeSound = scene.sound.add('horde-activated', { loop: false, volume: 0.8 });
      scene.claudeB2bSound = scene.sound.add('claude-b2b', { loop: false, volume: 0.7 });
    }
    
    static getInstance(scene?: Phaser.Scene): AudioManager {
      if (!AudioManager.instance && scene) {
        AudioManager.instance = new AudioManager(scene);
      }
      return AudioManager.instance;
    }

   
  
    static playSound(scene: Phaser.Scene, sound: Phaser.Sound.BaseSound): void {
      if (!sound) {
        return;
      }
  
      if (scene.sound.locked) {
        scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
          sound.play();
        });
        return;
      }
  
      sound.play();
    }
  
  static playClaudeB2bSound(scene: Phaser.Scene): void {
    if (!scene.claudeB2bSound) {
      return;
    }

    if (scene.sound.locked) {
      scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        scene.claudeB2bSound?.play();
      });
      return;
    }

    scene.claudeB2bSound.play();
  }
  
    
    // Extracted from GameScene lines 1040-1068
    play(soundKey: string): void {
      const sound = this.sounds.get(soundKey);
      if (!sound) return;
      
      if (this.scene.sound.locked) {
        this.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => sound.play());
      } else {
        sound.play();
      }
    }
    
    registerSound(key: string, sound: Phaser.Sound.BaseSound): void {
      this.sounds.set(key, sound);
    }
  }