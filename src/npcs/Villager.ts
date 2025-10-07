import Phaser from 'phaser';
import { NPC } from './Npc';

export class Villager extends NPC {
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to villager sprites.
            { key: 'villager-idle', path: 'villagers/1 Old_man/Old_man_idle.png', type: 'spritesheet', frameWidth: 48, frameHeight: 48 },
            // TODO: villager joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('villager-idle')) {
            scene.anims.create({ key: 'villager-idle', frames: scene.anims.generateFrameNames('villager-idle', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
        }
        // if (!has('vampire-death')) {
        //     scene.anims.create({ key: 'vampire-death', frames: scene.anims.generateFrameNames('vampire-death', { start: 0, end: 9 }), frameRate: 8, repeat: 0 });
        // }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'villager-idle', scale });
        Villager.registerAnimations(scene);
        this.getSprite().play('villager-idle', true);
    }

    checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = 2 * this.TILE_SIZE;
        const isNear = dist <= threshold;
        if (isNear && !this.wasNearPlayer) {
            console.log('villager says hello!');
        }
        this.wasNearPlayer = isNear;
    }

    triggerDeath(): void {
        const s = this.getSprite();
        s.play('villager-death', true);
        s.once('animationcomplete', () => s.setVisible(false));
    }

    triggerDelivery(): void {
        const s = this.getSprite();
        const scene = s.scene as any;
        
        if (scene.uiGameState && typeof scene.uiGameState.decrementFoodStuff === 'function') {
            const sandwichFood = "Ham Sandwiches 🥪";
            
            const foodCountsList = scene.uiGameState.getFoodCountsList();
            const hasSandwich = foodCountsList.some((item: string) => item.includes(sandwichFood) && !item.includes("x0"));
            
            if (hasSandwich) {
                scene.uiGameState.decrementFoodStuff(sandwichFood);
                scene.uiGameState.incrementTitleCount("Deliverer of Ham Sandwiches 🥪");
                scene.uiGameState.setScoreBasedOnTitles();

                if (scene.foodsList && typeof scene.foodsList.updateTitles === 'function') {
                    scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
                }
                if (scene.titleList && typeof scene.titleList.updateTitles === 'function') {
                    scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);
                }
            }
        }
    }
}