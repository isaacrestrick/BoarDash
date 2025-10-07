import Phaser from 'phaser';
import { NPC } from './NPC';

export class Vampire extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'vampire-idle', path: 'Vampires1/Idle/Vampires1_Idle_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
            { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('vampire-idle')) {
            scene.anims.create({ key: 'vampire-idle', frames: scene.anims.generateFrameNames('vampire-idle', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
        }
        if (!has('vampire-death')) {
            scene.anims.create({ key: 'vampire-death', frames: scene.anims.generateFrameNames('vampire-death', { start: 0, end: 9 }), frameRate: 8, repeat: 0 });
        }
    }

    private killed = false;

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'vampire-idle', scale });
        Vampire.registerAnimations(scene);
        this.getSprite().play('vampire-idle', true);
    }

    triggerDeath(): void {
        if (this.killed) return;
        this.killed = true;
        const s = this.getSprite();
        const scene = s.scene as any;
        

        
        s.play('vampire-death', true);
        s.once('animationcomplete', () => 
            {
                if (scene.uiGameState && typeof scene.uiGameState.incrementTitleCount === 'function') {
                    scene.uiGameState.incrementTitleCount("Slayer of Vampires 🧛");
                    scene.uiGameState.setScoreBasedOnTitles();
                    
                    if (scene.titleList && typeof scene.titleList.updateTitles === 'function') {
                      scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);
                    }
                  }
                s.setVisible(false)
            });
    }
}