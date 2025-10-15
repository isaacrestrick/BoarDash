import Phaser from 'phaser';
import { Skeleton } from './Skeleton';
import { type NpcAssetDefinition } from './Npc';
import GameScene from '../scenes/GameScene';

export class SalesEngineer extends Skeleton {
    private readonly visual: Phaser.GameObjects.Sprite;

    static override getRequiredAssets(): ReadonlyArray<NpcAssetDefinition> {
        return [
            { key: 'sales-engineer', path: 'sales-engineer.png', type: 'image' },
        ];
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 4.2 / 3.333) {
        super(scene, x, y, scale);
        this.health = 5;
        this.cooldownTime = 800;
        this.sprite.setScale(scale * 1.15);
        this.sprite.setAlpha(0);

        this.visual = scene.add.sprite(x, y, 'sales-engineer');

        const targetHeight = this.sprite.displayHeight;
        const overlayScale = targetHeight > 0 ? targetHeight / this.visual.height : 0.04;
        this.visual.setScale(overlayScale);
        this.visual.setDepth(this.sprite.depth + 1);
        this.visual.setScrollFactor(this.sprite.scrollFactorX, this.sprite.scrollFactorY);

        this.syncVisual();

        this.sprite.on('destroy', () => {
            this.visual.destroy();
        });
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

    override updateFollow(targetX: number, targetY: number, speed: number = 90): void {
        super.updateFollow(targetX, targetY, speed);
        this.syncVisual();
    }

    override triggerAttack(targetX: number, targetY: number): boolean {
        const didAttack = super.triggerAttack(targetX, targetY);
        if (didAttack) {
            this.flashVisual(0xffffff);
        }
        return didAttack;
    }

    override triggerDeath(): void {
        super.triggerDeath();
        this.flashVisual(0xffaaaa);
    }

    private syncVisual(): void {
        this.visual.setPosition(this.sprite.x, this.sprite.y);
        this.visual.setFlipX(this.sprite.flipX);
        this.visual.setDepth(this.sprite.depth + 1);
    }

    private flashVisual(color: number): void {
        this.visual.setTintFill(color);
        const scene = this.visual.scene;
        scene.time.delayedCall(120, () => {
            if (!this.visual.active) return;
            this.visual.clearTint();
        });
    }
}
