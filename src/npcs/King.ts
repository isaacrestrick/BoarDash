import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../scenes/GameScene'

export class King extends NPC {
    static getRequiredAssets() {
        return [
            // TODO: change the sprites to King sprites.
            { key: 'king-idle', path: 'MedievalKing/Sprites/Idle.png', type: 'spritesheet', frameWidth: 160, frameHeight: 111 },
            // TODO: King joy animation ?? (when you successfully deliver food, maybe they do a little dance, or get a little heart or something)
            // { key: 'vampire-death', path: 'Vampires1/Death/Vampires1_Death_full.png', type: 'spritesheet', frameWidth: 111, frameHeight: 111 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('king-idle')) {
            scene.anims.create({ key: 'king-idle', frames: scene.anims.generateFrameNames('king-idle', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
        }
        // if (!has('vampire-death')) {
        //     scene.anims.create({ key: 'vampire-death', frames: scene.anims.generateFrameNames('vampire-death', { start: 0, end: 9 }), frameRate: 8, repeat: 0 });
        // }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'king-idle', scale });
        King.registerAnimations(scene);
        this.getSprite().play('king-idle', true);
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
            const msg = 'Another beautiful day in the kingdom.'
            scene.events.emit("dialogue:show", msg)
            console.log(msg);
        }
        this.wasNearPlayer = isNear;
    }

    triggerDeath(): void {
        const s = this.getSprite();
        s.play('king-death', true);
        s.once('animationcomplete', () => s.setVisible(false));
    }

    triggerDelivery(): void {
        const s = this.getSprite();
        const scene = s.scene as any;        
        const burgerFood = "Kingly Burgers 🍔";
        
        const foodCountsList = scene.uiGameState.getFoodCountsList();
        const hasBurger = foodCountsList.some((item: string) => item.includes(burgerFood) && !item.includes("x0"));
        
        if (hasBurger && scene.uiGameState.allowedToDeliverBurger()) {
            scene.uiGameState.decrementFoodStuff(burgerFood);
            scene.uiGameState.incrementTitleCount("Favors owed by the king 👑");
            scene.uiGameState.setScoreBasedOnTitles();
            scene.events.emit("dialogue:show", "Thanks. I owe you one!")
            scene.time.delayedCall(2000, () => {
                scene.scene.stop('ui');
                scene.scene.start('GameOverScene', { score: scene.uiGameState.getScore(), win: true });
            });
            //scene.foodsList.updateTitles(["Foods", ...scene.uiGameState.getFoodCountsList()]);
            s.scene.events.emit("foods:update", scene.uiGameState.getFoodCountsList())
            //scene.titleList.updateTitles(["Titles", ...scene.uiGameState.getTitlesList()]);
            s.scene.events.emit("titles:update", scene.uiGameState.getTitlesList())
        } else if (!hasBurger && scene.uiGameState.allowedToDeliverBurger()) {
            scene.events.emit("dialogue:show", "I believe I ordered a burger?")
        } else {
            scene.events.emit("dialogue:show", "I will not eat before my subjects are fed and those skeletons are dead.")
        }
    }
}