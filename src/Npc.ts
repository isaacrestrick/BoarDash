import Phaser from 'phaser';
import GameScene from './GameScene'

export class NPC {
    private sprite: Phaser.GameObjects.Rectangle;
    private readonly TILE_SIZE = 32;
    private wasNearPlayer = false;
    private scene: GameScene;
    constructor(scene: GameScene, x: number, y: number) {
        this.scene = scene
        this.sprite = scene.add.rectangle(
            x,
            y,
            this.TILE_SIZE - 4,
            this.TILE_SIZE - 4,
            0x0000ff
        );
    }

    checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = this.TILE_SIZE;

        const isNear = dist <= threshold;
        if (isNear && !this.wasNearPlayer) {
            console.log('sddcontact');
            this.scene.uiGameState.addFoodStuff('Ham Sandwiches 🥪');
            this.scene.foodsList.updateTitles(["Foods", ...this.scene.uiGameState.getFoodCountsList()]);
            this.scene.titleList.updateTitles(["Titles", ...this.scene.uiGameState.getTitlesList()]);
    
        }
        this.wasNearPlayer = isNear;
    }
}