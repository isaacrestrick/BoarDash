import Phaser from 'phaser';
import { NPC } from './Npc';
import GameScene from '../scenes/GameScene'

export class Skeleton extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'skeleton-idle-up', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-idle-down', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-idle-left', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-idle-right', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-walk-up', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-walk-down', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-walk-left', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-walk-right', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-death', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-death-effect', path: 'Vampires1/Death/Vampires1_Death_smoke.png', type: 'spritesheet', frameWidth: 704/11, frameHeight: 256/4 },
        ] as const;
    }

    private health = 3

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);

        // idle
        if (!has('skeleton-idle-up')) {
            scene.anims.create({ key: 'skeleton-idle-up', frames: scene.anims.generateFrameNames('skeleton-idle-up', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-idle-down')) {
            scene.anims.create({ key: 'skeleton-idle-down', frames: scene.anims.generateFrameNames('skeleton-idle-down', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-idle-left')) {
            scene.anims.create({ key: 'skeleton-idle-left', frames: scene.anims.generateFrameNames('skeleton-idle-left', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-idle-right')) {
            scene.anims.create({ key: 'skeleton-idle-right', frames: scene.anims.generateFrameNames('skeleton-idle-right', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        }

        // walk
        if (!has('skeleton-walk-up')) {
            scene.anims.create({ key: 'skeleton-walk-up', frames: scene.anims.generateFrameNames('skeleton-walk-up', { start: 30, end: 35 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-walk-down')) {
            scene.anims.create({ key: 'skeleton-walk-down', frames: scene.anims.generateFrameNames('skeleton-walk-down', { start: 18, end: 23 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-walk-left')) {
            scene.anims.create({ key: 'skeleton-walk-left', frames: scene.anims.generateFrameNames('skeleton-walk-left', { start: 24, end: 29 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-walk-right')) {
            scene.anims.create({ key: 'skeleton-walk-right', frames: scene.anims.generateFrameNames('skeleton-walk-right', { start: 24, end: 29 }), frameRate: 10, repeat: -1 });
        }

        // death
        if (!has('skeleton-death')) {
            scene.anims.create({ key: 'skeleton-death', frames: scene.anims.generateFrameNames('skeleton-death', { start: 36, end: 39 }), frameRate: 8, repeat: 0 });
        }
        if (!has('skeleton-death-effect')) {
            scene.anims.create({ key: 'skeleton-death-effect', frames: scene.anims.generateFrameNames('skeleton-death-effect', { start: 4, end: 10 }), frameRate: 14, repeat: 0 });
        }
    }

    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down'

    private killed = false;

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 3.5) {
        super(scene, x, y, { key: 'skeleton-idle-down', scale });
        Skeleton.registerAnimations(scene);
        this.health = 3

        // collisions
        this.getSprite().setCollideWorldBounds(true);
        this.getSprite().body!.setSize(this.getSprite().width * 0.5, this.getSprite().height * 0.5);

        this.getSprite().play('skeleton-idle-down', true);
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
            const msg = 'Braaaaaaaaaaaaaaaaaains'
            scene.events.emit("dialogue:show", msg)
        }
        this.wasNearPlayer = isNear;
    }

    triggerDeath(): void {
        const s = this.sprite
        const scene = s.scene as GameScene
        if (this.health === 1) {
            // if (this.killed) return
            this.killed = true
            

            s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList())
            // scene.uiGameState.setScoreBasedOnTitles()

            s.play('skeleton-death', true)
            const deathEffect = scene.add.sprite(s.x, s.y, 'skeleton-death-effect');
            deathEffect.play('skeleton-death-effect', true);
            scene.events.emit("dialogue:show", "I died? Not again!")
            //scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()])
            const index = scene.skeletons.indexOf(this);
            if (index > -1) {
                scene.skeletons.splice(index, 1);
            }
            // console.log(scene.skeletons)
            s.setTintFill(0xffaaaa)
            s.scene.time.delayedCall(120, () => s.clearTint())
            s.once('animationcomplete', () => {
                console.log('death anim complete')
                scene.uiGameState.incrementTitleCount("Slayer of Skeletons ☠️")
                s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList())
                s.destroy()
                deathEffect.destroy()
            });
            // scene.uiGameState.setScoreBasedOnTitles()
            console.log('killed')
        } else {
            console.log('-1')
            this.health = this.health - 1
            s.setTintFill(0xffaaaa)
            s.scene.time.delayedCall(120, () => s.clearTint())
        }
    }

    private lastAttackTime = 0
    private cooldownTime = 1000 // 1 second between attacks
    private attackRangeX = this.TILE_SIZE * 0.9
    private attackRangeY = this.TILE_SIZE * 0.5

    triggerAttack(targetX: number, targetY: number): boolean {
        const s = this.sprite
        if (this.killed) return false

        const now = s.scene.time.now
        if (now < this.lastAttackTime + this.cooldownTime) return false

        const dx = targetX - s.x
        const dy = targetY - s.y + 10

        const inRange = Math.abs(dx) <= this.attackRangeX && Math.abs(dy) <= this.attackRangeY
        if (!inRange) return false

        s.setTintFill(0xffffff)
        s.scene.time.delayedCall(120, () => s.clearTint())

        this.lastAttackTime = now
        return true
    }

    updateFollow(targetX: number, targetY: number, speed: number = 90): void {
        const s = this.sprite

        const stopX = this.TILE_SIZE * 0.9 // stops them farter away on x axis
        const stopY = this.TILE_SIZE * 0.5

        const dx = targetX - s.x
        const dy = targetY - s.y + 10 // + shifts the target relative to player sprite

        const eliptDist = Math.hypot(dx / stopX, dy / stopY)
        if (eliptDist <= 1) {
            // attack handled in GameScene
            // this.triggerAttack(targetX, targetY)

            // WHEN UNCOMMENTED PREVENTING DEATH ANIM AND REMOVING FROM THE SKELETON ARRAY, fix if we need up, left, or right idling; if not - fuck it
            // s.play(`skeleton-idle-${this.lastDirection}`, true) 
            s.setVelocity(0, 0);
            return
        }

        const dist = Math.hypot(dx, dy)
        const nx = dx / dist
        const ny = dy / dist

        let newDirection: 'up' | 'down' | 'left' | 'right';

        if (Math.abs(dx) > Math.abs(dy)) {
            newDirection = dx > 0 ? 'right' : 'left';
        } else {
            newDirection = dy > 0 ? 'down' : 'up';
        }

        if (newDirection !== this.lastDirection) {
            this.lastDirection = newDirection;
        }

        s.play(`skeleton-walk-${this.lastDirection}`, true);
        if (newDirection === 'left') {
            s.setFlipX(true)
        } else {
            s.setFlipX(false)
        }

        if (eliptDist < 10) {
            s.setVelocity(nx * speed, ny * speed);
        } else {
            this.sprite.play('skeleton-idle-down', true)
            s.setVelocity(0, 0);
        }
    }
}