import Phaser from 'phaser';
import { NPC, type NpcConfig } from './Npc';
import type GameScene from '../scenes/GameScene';

export interface VillagerConfig extends NpcConfig {
    food: string;
    title: string;
    greetingDialogue: string;
    successDialogue: string;
    failureDialogue: string;
}

export class Villager extends NPC {
    food: string = "Turkey Sandwiches 🥪";
    title: string = "Deliverer of Turkey Sandwiches 🥪";
    greetingDialogue: string = "Good morning!";
    successDialogue: string = "You are a true Deliverer of Turkey Sandwiches 🥪!";
    failureDialogue: string = "I believe I ordered a Turkey Sandwich 🥪?";
    idleKey: string = "villager-mary-idle";
    
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to villager sprites.
            { key: 'villager-mary-idle', path: 'Cute_Fantasy/NPCs/Medieval_Mary.png', type: 'spritesheet', frameWidth: 512/8, frameHeight:896/(8 * 2) },
            { key: 'villager-katy-idle', path: 'Cute_Fantasy/NPCs/Bartender_Katy.png', type: 'spritesheet', frameWidth: 384/6, frameHeight:448/7 },
            { key: 'villager-bob-idle', path: 'Cute_Fantasy/NPCs/Farmer_Bob.png', type: 'spritesheet', frameWidth: 384/6, frameHeight:832/13 },
            { key: 'villager-buba-idle', path: 'Cute_Fantasy/NPCs/Farmer_Buba.png', type: 'spritesheet', frameWidth: 384/6, frameHeight:832/13 },
            { key: 'villager-fin-idle', path: 'Cute_Fantasy/NPCs/Fisherman_Fin.png', type: 'spritesheet', frameWidth: 576/9, frameHeight:832/13 },
            { key: 'villager-jack-idle', path: 'Cute_Fantasy/NPCs/Lumberjack_Jack.png', type: 'spritesheet', frameWidth: 384/6, frameHeight:640/10 }
            // TODO: villager joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('villager-mary-idle')) {
            scene.anims.create({ key: 'villager-mary-idle', frames: scene.anims.generateFrameNames('villager-mary-idle', { start: 0, end: 5}), frameRate: 4, repeat: -1 });
        }
        if (!has('villager-katy-idle')) {
            scene.anims.create({ key: 'villager-katy-idle', frames: scene.anims.generateFrameNames('villager-katy-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
        if (!has('villager-bob-idle')) {
            scene.anims.create({ key: 'villager-bob-idle', frames: scene.anims.generateFrameNames('villager-bob-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
        if (!has('villager-buba-idle')) {
            scene.anims.create({ key: 'villager-buba-idle', frames: scene.anims.generateFrameNames('villager-buba-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
        if (!has('villager-fin-idle')) {
            scene.anims.create({ key: 'villager-fin-idle', frames: scene.anims.generateFrameNames('villager-fin-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
        if (!has('villager-jack-idle')) {
            scene.anims.create({ key: 'villager-jack-idle', frames: scene.anims.generateFrameNames('villager-jack-idle', { start: 0, end: 5 }), frameRate: 4, repeat: -1 });
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5, config?: VillagerConfig) {//scale = 2.5, idlePath, food, title, greetingDialogue, successDialogue, failureDialogue) {
        super(scene, x, y, { key: config?.key ?? 'villager-mary-idle', scale });
        if (config) {
            this.food = config.food;
            this.title = config.title;
            this.greetingDialogue = config.greetingDialogue;
            this.successDialogue = config.successDialogue;
            this.failureDialogue = config.failureDialogue;
            this.idleKey = config.key;
        }

        Villager.registerAnimations(scene);
        this.getSprite().play(this.idleKey, true);
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