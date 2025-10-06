import Phaser from 'phaser';

interface AssetDefinition {
    key: string;
    path: string;
    type: 'image' | 'spritesheet' | 'audio' | 'json';
}

export class Player {
    private sprite: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private cursors: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    private readonly MOVE_SPEED = 200;
    private readonly TILE_SIZE = 32;
    private readonly GRID_WIDTH = 30;
    private readonly GRID_HEIGHT = 22;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'boar_knight_down');
        this.sprite.setScale(0.2);

        this.cursors = {
            W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
    }

    /**
     * Define the assets required by this Player
     * This method should be called by the scene during its preload phase
     */
    static getRequiredAssets(): AssetDefinition[] {
        return [
            { key: 'boar_knight_down', path: 'boar_knight_sprite/boar_knight_down.png', type: 'image' },
            { key: 'boar_knight_up', path: 'boar_knight_sprite/boar_knight_up.png', type: 'image' },
            { key: 'boar_knight_left', path: 'boar_knight_sprite/boar_knight_left.png', type: 'image' },
            { key: 'boar_knight_right', path: 'boar_knight_sprite/boar_knight_right.png', type: 'image' }
        ];
    }


    update(): void {
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.W.isDown) {
            velocityY = -this.MOVE_SPEED;
            this.sprite.setTexture('boar_knight_up');
        } else if (this.cursors.S.isDown) {
            velocityY = this.MOVE_SPEED;
            this.sprite.setTexture('boar_knight_down');
        }

        if (this.cursors.A.isDown) {
            velocityX = -this.MOVE_SPEED;
            this.sprite.setTexture('boar_knight_left');
        } else if (this.cursors.D.isDown) {
            velocityX = this.MOVE_SPEED;
            this.sprite.setTexture('boar_knight_right');
        }

        // Update player position
        this.sprite.x += velocityX * (this.scene.game.loop.delta / 1000);
        this.sprite.y += velocityY * (this.scene.game.loop.delta / 1000);

        // Keep player in bounds
        this.constrainToBounds();
    }

    private constrainToBounds(): void {
        const halfSize = (this.TILE_SIZE - 4) / 2;
        this.sprite.x = Phaser.Math.Clamp(
            this.sprite.x,
            halfSize,
            this.GRID_WIDTH * this.TILE_SIZE - halfSize
        );
        this.sprite.y = Phaser.Math.Clamp(
            this.sprite.y,
            halfSize,
            this.GRID_HEIGHT * this.TILE_SIZE - halfSize
        );
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }

    getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite;
    }

    getDistanceTo(x: number, y: number): number {
        const dx = this.sprite.x - x;
        const dy = this.sprite.y - y;
        return Math.hypot(dx, dy);
    }
}
