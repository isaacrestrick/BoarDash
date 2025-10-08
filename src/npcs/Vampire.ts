import Phaser from 'phaser';
import { NPC } from './Npc';
import GameScene from '../GameScene'
import DialogueMessage from '../dialogue/DialogueMessage';

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

    checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = 2 * this.TILE_SIZE;
        const isNear = dist <= threshold;
        if (isNear && !this.wasNearPlayer) {
            const s = this.getSprite();
            const scene = s.scene as GameScene;
            const msg = 'It sure is bright out.'
            scene.dialogueManager.show(msg)
        }
        this.wasNearPlayer = isNear;
    }

    triggerDeath(): void {
        if (this.killed) return;
        this.killed = true;
        const s = this.getSprite();
        const scene = s.scene as GameScene;
        s.play('vampire-death', true);
        s.once('animationcomplete', () => 
            {
                scene.uiGameState.incrementTitleCount("Slayer of Vampires 🧛");
                scene.uiGameState.setScoreBasedOnTitles();
                scene.dialogueManager.show("I've McFallen.")
                scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);                  
                s.setVisible(false)
            });
    }
}