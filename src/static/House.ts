import Phaser from 'phaser';
import { Static } from './Static';

export class House extends Static {
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to villager sprites.
            { key: 'house', path: 'village_home.png', type: 'spritesheet', frameWidth: 1024, frameHeight: 1024 },
            // TODO: villager joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('house')) {
            scene.anims.create({ key: 'house', frames: scene.anims.generateFrameNames('house', { start: 0, end: 0 }), frameRate: 8, repeat: -1 });
        }
        // if (!has('vampire-death')) {
        //     scene.anims.create({ key: 'vampire-death', frames: scene.anims.generateFrameNames('vampire-death', { start: 0, end: 9 }), frameRate: 8, repeat: 0 });
        // }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'house', scale });
        House.registerAnimations(scene);
        this.getSprite().play('house', true);
    }
}