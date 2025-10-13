import Phaser from 'phaser';
import { Skeleton } from './Skeleton';
import GameScene from '../scenes/GameScene';

export class SalesEngineer extends Skeleton {
    static override getRequiredAssets() {
        return Skeleton.getRequiredAssets();
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 4.2 / 3.333) {
        super(scene, x, y, scale);
        this.health = 5;
        this.cooldownTime = 800;
        this.sprite.setTint(0xffcc66);
        this.sprite.setScale(scale * 1.15);
    }

    override checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = 2 * this.TILE_SIZE;
        const isNear = dist <= threshold;

        if (isNear && !this.wasNearPlayer) {
            const s = this.getSprite();
            const scene = s.scene as GameScene;
            const msg = 'You know it\'s serious when the sales engineer joins the meeting.';
            scene.events.emit('dialogue:show', msg);
        }

        this.wasNearPlayer = isNear;
    }
}
