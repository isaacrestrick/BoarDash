import Phaser from 'phaser';

interface AssetDefinition {
    key: string;
    path: string;
    type: 'image' | 'spritesheet' | 'audio' | 'json';
    frameWidth?: number;
    frameHeight?: number;
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
    private attackKey: Phaser.Input.Keyboard.Key;
    private spaceKey: Phaser.Input.Keyboard.Key;
    private foodKey: Phaser.Input.Keyboard.Key;
    private readonly MOVE_SPEED = 200;
    private readonly TILE_SIZE = 32;
    private readonly GRID_WIDTH = 45;
    private readonly GRID_HEIGHT = 33;
    private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'knight-sprite');
        this.sprite.setScale(4.5);

        Player.registerAnimations(scene);

        this.cursors = {
            W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
        this.attackKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.foodKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.sprite.play('knight-idle');
    }

    static getRequiredAssets(): AssetDefinition[] {
        return [
            { key: 'knight-sprite', path: 'knight-sprite.png', type: 'spritesheet', frameWidth: 32, frameHeight: 32 },
        ];
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('knight-idle')) {
            scene.anims.create({ key: 'knight-idle', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        }
        if (!has('knight-right')) {
            scene.anims.create({ key: 'knight-right', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 10, end: 17 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-up')) {
            scene.anims.create({ key: 'knight-up', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 20, end: 27 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-left')) {
            scene.anims.create({ key: 'knight-left', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 30, end: 37 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-down')) {
            scene.anims.create({ key: 'knight-down', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 40, end: 47 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-attack-right')) {
            scene.anims.create({ key: 'knight-attack-right', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 160, end: 165 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-attack-up')) {
            scene.anims.create({ key: 'knight-attack-up', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 170, end: 175 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-attack-left')) {
            scene.anims.create({ key: 'knight-attack-left', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 180, end: 185 }), frameRate: 8, repeat: 1 });
        }
        if (!has('knight-attack-down')) {
            scene.anims.create({ key: 'knight-attack-down', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 190, end: 195 }), frameRate: 8, repeat: 1 });
        }
    }

    update(): void {
        let velocityX = 0;
        let velocityY = 0;

        const speedMultiplier = this.spaceKey.isDown ? 2 : 1;

        this.sprite.anims.timeScale = speedMultiplier;

        if (this.cursors.W.isDown) {
            velocityY = -this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'up';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-up' : 'knight-up', true);
        } else if (this.cursors.S.isDown) {
            velocityY = this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'down';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-down' : 'knight-down', true);
        }

        if (this.cursors.A.isDown) {
            velocityX = -this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'left';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-left' : 'knight-left', true);
        } else if (this.cursors.D.isDown) {
            velocityX = this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'right';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-right' : 'knight-right', true);
        }

        if (velocityX === 0 && velocityY === 0) {
            this.sprite.play(this.attackKey.isDown ? `knight-attack-${this.lastDirection}` : 'knight-idle', true);
        }

        this.sprite.x += velocityX * (this.scene.game.loop.delta / 1000);
        this.sprite.y += velocityY * (this.scene.game.loop.delta / 1000);

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

    isAttacking(): boolean {
        return this.attackKey.isDown;
    }

    justPressedFoodKey(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.foodKey);
    }
}