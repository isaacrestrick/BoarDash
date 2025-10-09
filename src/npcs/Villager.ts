import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../scenes/GameScene';

export class Villager extends NPC {
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to villager sprites.
            { key: 'villager-idle', path: 'Cute_Fantasy/NPCs/Medieval_Mary.png', type: 'spritesheet', frameWidth: 512/8, frameHeight:896/(8 * 2) },
            // TODO: villager joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('villager-idle')) {
            scene.anims.create({ key: 'villager-idle', frames: scene.anims.generateFrameNames('villager-idle', { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
        }
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
            const s = this.getSprite();
            const scene = s.scene as GameScene;
            const msg = 'Good morning!'
            scene.events.emit("dialogue:show", msg)
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
        const scene = s.scene as GameScene;
        const sandwichFood = "Turkey Sandwiches 🥪";
        
        const foodCountsList = scene.uiGameState.getFoodCountsList();
        const hasSandwich = foodCountsList.some((item: string) => item.includes(sandwichFood) && !item.includes("x0"));
        
        if (hasSandwich) {
            scene.uiGameState.decrementFoodStuff(sandwichFood);
            scene.uiGameState.incrementTitleCount("Deliverer of Turkey Sandwiches 🥪");
            scene.events.emit("dialogue:show", "You are a true Deliverer of Turkey Sandwiches 🥪!")
            scene.uiGameState.setScoreBasedOnTitles();
            //scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
            s.scene.events.emit("foods:update", scene.uiGameState.getFoodCountsList())
            //scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);
            s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList())
        } else {
            scene.events.emit("dialogue:show", "I believe I ordered a Turkey Sandwich 🥪?")
        }
    }
}