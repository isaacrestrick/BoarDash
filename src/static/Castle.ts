import Phaser from 'phaser';
import { Static } from './Static';

export class Castle extends Static {
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to villager sprites.
            { key: 'castle', path: 'PixelCastleTowers/sprite1.png', type: 'spritesheet', frameWidth: 1024, frameHeight: 1024 },
            // TODO: villager joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('castle')) {
            scene.anims.create({ key: 'castle', frames: scene.anims.generateFrameNames('castle', { start: 0, end: 0 }), frameRate: 8, repeat: -1 });
        }
        // if (!has('vampire-death')) {
        //     scene.anims.create({ key: 'vampire-death', frames: scene.anims.generateFrameNames('vampire-death', { start: 0, end: 9 }), frameRate: 8, repeat: 0 });
        // }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'castle', scale });
        Castle.registerAnimations(scene);
        this.getSprite().play('castle', true);
    }
}