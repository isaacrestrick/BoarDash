import Phaser from 'phaser';
import { NPC, type NpcConfig } from './Npc';
import type GameScene from '../scenes/GameScene';

export interface VillagerConfig extends NpcConfig {
    food: string;
    title: string;
    greetingDialogue: string;
    successDialogue: string;
    failureDialogue: string;
    idlePath: string;  // may be a key instead of a path...
}

export class Villager extends NPC {
    food: string = "Turkey Sandwiches 🥪";
    title: string = "Deliverer of Turkey Sandwiches 🥪";
    greetingDialogue: string = "Good morning!";
    successDialogue: string = "You are a true Deliverer of Turkey Sandwiches 🥪!";
    failureDialogue: string = "I believe I ordered a Turkey Sandwich 🥪?";
    idlePath: string = 'Cute_Fantasy/NPCs/Medieval_Mary.png'; // may be a key instead of a path...
    
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

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5, config?: VillagerConfig) {//scale = 2.5, idlePath, food, title, greetingDialogue, successDialogue, failureDialogue) {
        super(scene, x, y, { key: 'villager-idle', scale });
        Villager.registerAnimations(scene);
        if (config) {
            this.food = config.food;
            this.title = config.title;
            this.greetingDialogue = config.greetingDialogue;
            this.successDialogue = config.successDialogue;
            this.failureDialogue = config.failureDialogue;
            //this.idlePath =
        }
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
            scene.events.emit("dialogue:show", this.greetingDialogue)
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
        
        const foodCountsList = scene.uiGameState.getFoodCountsList();
        const hasFood = foodCountsList.some((item: string) => item.includes(this.food) && !item.includes("x0"));
        
        if (hasFood) {
            scene.uiGameState.decrementFoodStuff(this.food);
            scene.uiGameState.incrementTitleCount(this.title);
            scene.events.emit("dialogue:show", this.successDialogue)
            scene.uiGameState.setScoreBasedOnTitles();

            s.scene.events.emit("foods:update", scene.uiGameState.getFoodCountsList())
            s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList())
        } else {
            scene.events.emit("dialogue:show", this.failureDialogue)
        }
    }
}