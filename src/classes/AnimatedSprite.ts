

export type AnimationConfig = Partial<{
    imgPath: string;
    num_columns: number;
    num_rows: number;
    name: string;
    start_frame: number;
    end_frame: number;
    frame_rate: number;
    repeat: number;
    action: string;
    x: number;
    y: number;
    depth: number;
  }>;
  
export class AnimatedSprite {
    static async getImageDimensions(src: string): Promise<{ width: number; height: number }> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = src;
      });
    }
    static preloadAssets(scene: GameScene, config: AnimationConfig) {
      if (!config.imgPath) return;
      this.getImageDimensions(config.imgPath).then(({ width, height }) => {
        scene.load.spritesheet(`${config.name}-sprite`, config.imgPath, {
          frameWidth: width / config.num_columns,
          frameHeight: height / config.num_rows
        });
      });
    }
    static addAnimation(scene: GameScene, config: AnimationConfig) {
        scene.anims.create({
              key: `${config.name}-${config.action}`, 
              frames: scene.anims.generateFrameNumbers(`${config.name}-sprite`, { start: config.start_frame, end: config.end_frame }), 
              frameRate: config.frame_rate, 
              repeat: config.repeat
        });
    }
    static addSpriteAndPlayAnimation(scene: GameScene, config: AnimationConfig, x: number, y: number) {
      //AddSpriteAndPlayAnimation
      let sprite = scene.add.sprite(x, y, `${config.name}-sprite`);
      sprite.play(`${config.name}-${config.action}`, true);
      if (typeof config.depth === 'number') {
        sprite.setDepth(config.depth);
      }
    }
  
    static playAnimation(scene: GameScene, config: AnimationConfig, x: number, y: number) {
      //AddAnimation
      this.addAnimation(scene, config);
      this.addSpriteAndPlayAnimation(scene, config, x, y);
    }
    
  }