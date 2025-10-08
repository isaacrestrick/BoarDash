import Phaser from 'phaser';
import { NPC } from './Npc';
import GameScene from '../GameScene'

export class Skeleton extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'skeleton-idle', path: 'Cute_Fantasy/Enemies/Skeleton/Skeleton.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
            { key: 'skeleton-death', path: 'Cute_Fantasy/Enemies/Bombschroom/Toxic_Gas_Cloud_VFX.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('skeleton-idle')) {
            scene.anims.create({ key: 'skeleton-idle', frames: scene.anims.generateFrameNames('skeleton-idle', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        }
        if (!has('skeleton-death')) {
            scene.anims.create({ key: 'skeleton-death', frames: scene.anims.generateFrameNames('skeleton-death', { start: 0, end: 5 }), frameRate: 12, repeat: 0 });
        }
    }

    private killed = false;

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 3.5) {
        super(scene, x, y, { key: 'skeleton-idle', scale });
        Skeleton.registerAnimations(scene);
        this.getSprite().play('skeleton-idle', true);
    }

    triggerDeath(): void {
        if (this.killed) return;
        this.killed = true;
        const s = this.getSprite();
        const scene = s.scene as GameScene;
        s.play('skeleton-death', true);
        s.once('animationcomplete', () => 
            {
                scene.uiGameState.incrementTitleCount("Slayer of Skeletons ☠️");
                scene.uiGameState.setScoreBasedOnTitles();
                scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);                  
                s.setVisible(false)
            });
    }

    // triggerArrack() or smth

    updateFollow(targetX: number, targetY: number, speed: number = 90): void {
		const s = this.sprite
        
        const stopX = this.TILE_SIZE * 3.1 // stops them farter away on x axis
        const stopY = this.TILE_SIZE * 1.2

		const dx = targetX - s.x
		const dy = targetY - s.y + 25 // + shifts the target relative to player sprite

		const eliptDist = Math.hypot(dx/stopX, dy/stopY)
		if (eliptDist <= 1) return

        const dist = Math.hypot(dx, dy)
		const nx = dx / dist
		const ny = dy / dist
		const dt = s.scene.game.loop.delta / 1000

		s.x += nx * speed * dt;
		s.y += ny * speed * dt;
	}
}