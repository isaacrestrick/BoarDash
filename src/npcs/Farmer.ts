import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../scenes/GameScene'

export class Farmer extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'farmer-idle', path: 'Cute_Fantasy/NPCs/Bartender_Bruno.png', type: 'spritesheet', frameWidth: 384 / 6, frameHeight: 448 / 7 },
        ] as const;
    }


    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('farmer-idle')) {
            scene.anims.create({ key: 'farmer-idle', frames: scene.anims.generateFrameNames('farmer-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 0.3) {
        super(scene, x, y, { key: 'farmer-idle', scale });
        Farmer.registerAnimations(scene);
        this.getSprite().play('farmer-idle', true);
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
            const msg = 'Good day on the farm today.'
            scene.events.emit("dialogue:show", msg)
            console.log(msg);
        }
        this.wasNearPlayer = isNear;
    }

    triggerPickUp(): void {
        const s = this.getSprite();
        const scene = s.scene as GameScene;
        const foods = ["Turkey Sandwiches 🥪", "Kingly Burgers 🍔"];
        const foodSingulars = {
            "Turkey Sandwiches 🥪": "Turkey Sandwich 🥪",
            "Kingly Burgers 🍔": "Kingly Burger 🍔"
        };
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        scene.uiGameState.addFoodStuff(randomFood);
        scene.events.emit("dialogue:show", "Here is your food: 1x " + foodSingulars[randomFood]);
        //scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
        s.scene.events.emit("foods:update", scene.uiGameState.getFoodCountsList())
    }
}