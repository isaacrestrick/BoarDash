import Phaser from 'phaser';

export type NpcConfig = {
    key: string; // texture key
    scale?: number;
};

export class NPC {
    protected sprite: Phaser.Physics.Arcade.Sprite;
    protected readonly TILE_SIZE = 32;
    protected wasNearPlayer = false;

    constructor(scene: Phaser.Scene, x: number, y: number, config?: NpcConfig) {
        const key = config?.key ?? 'farmer-sprite';
        this.sprite = scene.physics.add.sprite(x, y, key);
        if (config?.scale !== undefined) this.sprite.setScale(config.scale);
    }

    getX(): number { return this.sprite.x; }
    getY(): number { return this.sprite.y; }
    getSprite(): Phaser.Physics.Arcade.Sprite { return this.sprite; }

    // Default proximity interaction (log only). Subclasses can override to add behavior.
    checkPlayerInteraction(playerX: number, playerY: number): void {
        const dx = playerX - this.sprite.x;
        const dy = playerY - this.sprite.y;
        const dist = Math.hypot(dx, dy);
        const threshold = 2 * this.TILE_SIZE;
        const isNear = dist <= threshold;
        if (isNear && !this.wasNearPlayer) {
            console.log('contact');
        }
        this.wasNearPlayer = isNear;
    }

    isPlayerNear(): boolean {
        return this.wasNearPlayer;
    }
}