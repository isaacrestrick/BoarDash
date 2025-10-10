import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../scenes/GameScene'

export class Claude extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'claude-1', path: 'claude/claude_1.png', type: 'image' },
            { key: 'claude-2', path: 'claude/claude_2.png', type: 'image' },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('claude-idle')) {
            scene.anims.create({
                key: 'claude-idle',
                frames: [
                    { key: 'claude-1' },
                    { key: 'claude-2' }
                ],
                frameRate: 2,
                repeat: -1
            });
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        Claude.registerAnimations(scene);
        super(scene, x, y, { key: 'claude-1', scale });
        this.sprite.visible = false
    }
    
    checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = 2 * this.TILE_SIZE;
        const isNear = dist <= threshold;
        if (isNear && !this.wasNearPlayer) {
            this.sprite.visible = true
            this.getSprite().play('claude-idle', true);
            const s = this.getSprite();
            const scene = s.scene as GameScene;
            const msg = `You're absolutely right!`
            scene.events.emit("dialogue:show", msg)
            console.log(msg);
        }
        this.wasNearPlayer = isNear;
    }

}