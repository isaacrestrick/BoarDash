import Phaser from 'phaser';
import { Skeleton } from './Skeleton';
import GameScene from '../scenes/GameScene';

export class MageSkeleton extends Skeleton {
    static override getRequiredAssets() {
        return [
            { key: 'mage-skeleton-idle-up', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-idle-down', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-idle-left', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-idle-right', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-walk-up', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-walk-down', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-walk-left', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-walk-right', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-death', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton_Mage.png', type: 'spritesheet' as const, frameWidth: 32, frameHeight: 32 },
            { key: 'mage-skeleton-death-effect', path: 'Vampires1/Death/Vampires1_Death_smoke.png', type: 'spritesheet' as const, frameWidth: 704/11, frameHeight: 256/4 },
        ];
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);

        // idle
        if (!has('mage-skeleton-idle-up')) {
            scene.anims.create({ key: 'mage-skeleton-idle-up', frames: scene.anims.generateFrameNames('mage-skeleton-idle-up', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-idle-down')) {
            scene.anims.create({ key: 'mage-skeleton-idle-down', frames: scene.anims.generateFrameNames('mage-skeleton-idle-down', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-idle-left')) {
            scene.anims.create({ key: 'mage-skeleton-idle-left', frames: scene.anims.generateFrameNames('mage-skeleton-idle-left', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-idle-right')) {
            scene.anims.create({ key: 'mage-skeleton-idle-right', frames: scene.anims.generateFrameNames('mage-skeleton-idle-right', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        }

        // walk
        if (!has('mage-skeleton-walk-up')) {
            scene.anims.create({ key: 'mage-skeleton-walk-up', frames: scene.anims.generateFrameNames('mage-skeleton-walk-up', { start: 30, end: 35 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-walk-down')) {
            scene.anims.create({ key: 'mage-skeleton-walk-down', frames: scene.anims.generateFrameNames('mage-skeleton-walk-down', { start: 18, end: 23 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-walk-left')) {
            scene.anims.create({ key: 'mage-skeleton-walk-left', frames: scene.anims.generateFrameNames('mage-skeleton-walk-left', { start: 24, end: 29 }), frameRate: 10, repeat: -1 });
        }
        if (!has('mage-skeleton-walk-right')) {
            scene.anims.create({ key: 'mage-skeleton-walk-right', frames: scene.anims.generateFrameNames('mage-skeleton-walk-right', { start: 24, end: 29 }), frameRate: 10, repeat: -1 });
        }

        // death
        if (!has('mage-skeleton-death')) {
            scene.anims.create({ key: 'mage-skeleton-death', frames: scene.anims.generateFrameNames('mage-skeleton-death', { start: 36, end: 39 }), frameRate: 8, repeat: 0 });
        }
        if (!has('mage-skeleton-death-effect')) {
            scene.anims.create({ key: 'mage-skeleton-death-effect', frames: scene.anims.generateFrameNames('mage-skeleton-death-effect', { start: 4, end: 10 }), frameRate: 14, repeat: 0 });
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 3.5) {
        super(scene, x, y, scale);
        
        // Override sprite with mage-skeleton texture
        this.sprite.setTexture('mage-skeleton-idle-down');
        
        MageSkeleton.registerAnimations(scene);
        this.getSprite().play('mage-skeleton-idle-down', true);
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
            const msg = 'Braaaaaaaaaaaaaaaaaains';
            scene.events.emit("dialogue:show", msg);
        }
        this.wasNearPlayer = isNear;
    }

    triggerDeath(): void {
        const s = this.sprite;
        const scene = s.scene as GameScene;
        if (this.health === 1) {
            this.killed = true;

            s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList());

            s.play('mage-skeleton-death', true);
            const deathEffect = scene.add.sprite(s.x, s.y, 'mage-skeleton-death-effect');
            deathEffect.play('mage-skeleton-death-effect', true);
            
            scene.events.emit("skeleton:died", this);

            s.setTintFill(0xffaaaa);
            s.scene.time.delayedCall(120, () => s.clearTint());
            s.once('animationcomplete', () => {
                console.log('mage-skeleton death anim complete');
                scene.uiGameState.incrementTitleCount("Slayer of Skeletons ☠️");
                s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList());
                s.destroy();
                deathEffect.destroy();
            });
            console.log('killed');
        } else {
            console.log('-1');
            this.health = this.health - 1;
            s.setTintFill(0xffaaaa);
            s.scene.time.delayedCall(120, () => s.clearTint());
        }
    }

    triggerAttack(targetX: number, targetY: number): boolean {
        const s = this.sprite;
        if (this.killed) return false;

        const now = s.scene.time.now;
        if (now < this.lastAttackTime + this.cooldownTime) return false;

        const dx = targetX - s.x;
        const dy = targetY - s.y + 10;

        const inRange = Math.abs(dx) <= this.attackRangeX && Math.abs(dy) <= this.attackRangeY;
        if (!inRange) return false;

        s.setTintFill(0xffffff);
        s.scene.time.delayedCall(120, () => s.clearTint());

        this.lastAttackTime = now;
        return true;
    }

    applyKnockback(sourceX: number, sourceY: number, strength: number = 2500, duration: number = 150): void {
        const body = this.sprite as Phaser.Physics.Arcade.Sprite | null;
        if (!body) return;
        const dir = new Phaser.Math.Vector2(body.x - sourceX, body.y - sourceY);
        if (!dir.lengthSq()) return;
        dir.normalize();

        body.setAcceleration(0, 0);
        body.setAcceleration(dir.x * strength, dir.y * strength);
        this.isRecoiling = true;

        const scene = this.sprite.scene as Phaser.Scene | null;
        if (!scene) return;

        scene.time.delayedCall(duration, () => {
            if (!this.killed) {
                body.setVelocity(0, 0);
            }
            this.isRecoiling = false;
        });
    }

    updateFollow(targetX: number, targetY: number, speed: number = 90): void {
        if (this.isRecoiling) {
            return;
        }

        const s = this.sprite;

        const stopX = this.TILE_SIZE * 0.9;
        const stopY = this.TILE_SIZE * 0.5;

        const dx = targetX - s.x;
        const dy = targetY - s.y + 10;

        const eliptDist = Math.hypot(dx / stopX, dy / stopY);
        if (eliptDist <= 1) {
            s.setVelocity(0, 0);
            return;
        }

        const dist = Math.hypot(dx, dy);
        const nx = dx / dist;
        const ny = dy / dist;

        let newDirection: 'up' | 'down' | 'left' | 'right';

        if (Math.abs(dx) > Math.abs(dy)) {
            newDirection = dx > 0 ? 'right' : 'left';
        } else {
            newDirection = dy > 0 ? 'down' : 'up';
        }

        if (newDirection !== this.lastDirection) {
            this.lastDirection = newDirection;
        }

        s.play(`mage-skeleton-walk-${this.lastDirection}`, true);
        if (newDirection === 'left') {
            s.setFlipX(true);
        } else {
            s.setFlipX(false);
        }

        if (eliptDist < 10) {
            s.setVelocity(nx * speed, ny * speed);
        } else {
            this.sprite.play('mage-skeleton-idle-down', true);
            s.setVelocity(0, 0);
        }
    }
}

