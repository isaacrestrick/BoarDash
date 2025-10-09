import Phaser from 'phaser';
import { NPC } from './Npc';
import type GameScene from '../scenes/GameScene'

export class SecondKing extends NPC {
    static getRequiredAssets() {
        return [
            { key: 'second-king-idle', path: 'Cute_Fantasy/NPCs/other-king-sprite.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },
        ] as const;
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('second-king-idle')) {
            scene.anims.create({ key: 'second-king-idle', frames: scene.anims.generateFrameNames('second-king-idle', { start: 0, end: 7 }), frameRate: 8, repeat: -1 });
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, scale = 2.5) {
        super(scene, x, y, { key: 'second-king-idle', scale });
        SecondKing.registerAnimations(scene);
        this.getSprite().play('second-king-idle', true);
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
            const msg = `I wouldn't...`
            scene.events.emit("dialogue:show", msg)
        }
        this.wasNearPlayer = isNear;
    }

    /*triggerDeath(): void {
        const s = this.getSprite();
        s.play('king-death', true);
        s.once('animationcomplete', () => s.setVisible(false));
    }*/

    /*triggerDelivery(): void {
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
    }*/
}