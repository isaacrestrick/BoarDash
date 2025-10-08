import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../GameScene'
import DialogueMessage from '../dialogue/DialogueMessage';

export class Farmer extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'farmer-idle', path: 'farmer-sprite.png', type: 'spritesheet', frameWidth: 250, frameHeight: 250 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('farmer-idle')) {
            scene.anims.create({ key: 'farmer-idle', frames: scene.anims.generateFrameNames('farmer-idle', { start: 0, end: 3 }), frameRate: 1, repeat: -1 });
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
            scene.dialogueManager.show(msg)
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
        scene.dialogueManager.show("Here is your food: 1x " + foodSingulars[randomFood]);
        scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
    }
}