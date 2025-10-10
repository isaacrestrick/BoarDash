import Phaser from 'phaser';
import { NPC, type NpcConfig } from './Npc';
import type GameScene from '../scenes/GameScene'

export interface FarmerConfig extends NpcConfig{
    greetingDialogue: string;
    foods: string[];
    foodSingulars: Record<string, string>;
}


export class Farmer extends NPC {
    greetingDialogue: string = "Good day on the farm today.";
    foods: string[] = ["Turkey Sandwiches 🥪", "Kingly Burgers 🍔"];
    foodSingulars: Record<string, string> = {
        "Turkey Sandwiches 🥪": "Turkey Sandwich 🥪",
        "Kingly Burgers 🍔": "Kingly Burger 🍔"
    };

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

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 0.3, config: FarmerConfig) {
        super(scene, x, y, { key: 'farmer-idle', scale });
        Farmer.registerAnimations(scene);
        this.getSprite().play('farmer-idle', true);
        if (config) {
            this.greetingDialogue = config.greetingDialogue
            this.foods = config.foods
            this.foodSingulars = config.foodSingulars
        }
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
            scene.events.emit("dialogue:show", this.greetingDialogue)
        }
        this.wasNearPlayer = isNear;
    }

    triggerPickUp(): void {
        const s = this.getSprite();
        const scene = s.scene as GameScene;

        s.setTintFill(0xaaffaa)
        s.scene.time.delayedCall(80, () => s.clearTint())

        const randomFood = this.foods[Math.floor(Math.random() * this.foods.length)];
        scene.uiGameState.addFoodStuff(randomFood);
        scene.events.emit("dialogue:show", "Here is your food: 1x " + this.foodSingulars[randomFood]);
        //scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
        s.scene.events.emit("foods:update", scene.uiGameState.getFoodCountsList())
    }
}