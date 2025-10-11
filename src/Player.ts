import Phaser from 'phaser';
import type GameScene from './scenes/GameScene';

interface AssetDefinition {
    key: string;
    path: string;
    type: 'image' | 'spritesheet' | 'audio' | 'json';
    frameWidth?: number;
    frameHeight?: number;
}

export class Player {
    private sprite: Phaser.Physics.Arcade.Sprite;
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
    private readonly MOVE_SPEED = 120;
    private readonly TILE_SIZE = 32;
    private readonly GRID_WIDTH = 45;
    private readonly GRID_HEIGHT = 33;
    private lastDirection: 'up' | 'down' | 'left' | 'right' | 'front' | 'back';
    private health = 3

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'knight-sprite');
        this.sprite.setScale(0.18);
        this.sprite.setDepth(1000); // Ensure player appears above all other objects
        this.health = 10;//000;
        this.lastDirection = 'front';

        // Enable physics collisions
        this.sprite.setCollideWorldBounds(true);
        //this.sprite.body!.setOffset(240, 132)
        this.sprite.body!.setSize(this.sprite.width * 0.07, this.sprite.height * 0.07);

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

    getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    static getRequiredAssets(): AssetDefinition[] {
        return [
            { key: 'knight-sprite', path: 'boar_knight/right/Knight-Idle-Right.png', type: 'spritesheet', frameWidth: (1584 / 6), frameHeight: (1506 / 6) },

            {key: 'knight-idle-front', path: 'boar_knight/front/Knight-Idle-Front.png', type: 'spritesheet', frameWidth: (1224 / 6), frameHeight: (1632 / 6) },

            {key: 'knight-idle-left', path: 'boar_knight/left/Knight-Idle-Left.png', type: 'spritesheet', frameWidth: (1584 / 6), frameHeight: (1440 / 6) },

            { key: 'knight-attack-back', path: 'boar_knight/back/Knight-Attack-Back.png', type: 'spritesheet', frameWidth: 432, frameHeight: 361 },
            { key: 'knight-walk-back', path: 'boar_knight/back/Knight-Walk-Back.png', type: 'spritesheet', frameWidth: 174, frameHeight: 274 },
            {
                key: 'knight-attack-front',
                path: 'boar_knight/front/Knight-Attack-Front.png',
                type: 'spritesheet',
                frameWidth: 2520 / 6,
                frameHeight: 1974 / 6
            },
            {
                key: 'knight-walk-front',
                path: 'boar_knight/front/Knight-Walk-Front.png',
                type: 'spritesheet',
                frameWidth: 1104 / 6,
                frameHeight: 1614 / 6
            },
            {
                key: 'knight-attack-left',
                path: 'boar_knight/left/Knight-Attack-Left.png',
                type: 'spritesheet',
                frameWidth: 2568 / 6,
                frameHeight: 2016 / 6
            },
            {
                key: 'knight-walk-left',
                path: 'boar_knight/left/Knight-Walk-Left.png',
                type: 'spritesheet',
                frameWidth: 1638 / 6,
                frameHeight: 1476 / 6
            },
            {
                key: 'knight-attack-right',
                path: 'boar_knight/right/Knight-Attack-Right.png',
                type: 'spritesheet',
                frameWidth: 1902 / 6,
                frameHeight: 1902 / 6
            },
            {
                key: 'knight-walk-right',
                path: 'boar_knight/right/Knight-Walk-Right.png',
                type: 'spritesheet',
                frameWidth: 264,
                frameHeight: 253
            }
        ];
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        if (!has('knight-idle')) {
            scene.anims.create({ key: 'knight-idle', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }

        if (!has('knight-idle-right')) {
            scene.anims.create({ key: 'knight-idle-right', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }

        if (!has('knight-idle-left')) {
            scene.anims.create({ key: 'knight-idle-left', frames: scene.anims.generateFrameNumbers('knight-idle-left', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }
        if (!has('knight-idle-front')) {
            scene.anims.create({ key: 'knight-idle-front', frames: scene.anims.generateFrameNumbers('knight-idle-front', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }






        if (!has('knight-walk-right')) {
            scene.anims.create({ key: 'knight-walk-right', frames: scene.anims.generateFrameNumbers('knight-walk-right', { start: 0, end: 35 }), frameRate: 16, repeat: 1 });
        }
        if (!has('knight-walk-left')) {
            scene.anims.create({ key: 'knight-walk-left', frames: scene.anims.generateFrameNumbers('knight-walk-left', { start: 0, end: 35 }), frameRate: 16, repeat: 1 });
        }
        if (!has('knight-walk-back')) {
            scene.anims.create({ key: 'knight-walk-back', frames: scene.anims.generateFrameNumbers('knight-walk-back', { start: 0, end: 35 }), frameRate: 24, repeat: 1 });
        }
        if (!has('knight-walk-front')) {
            scene.anims.create({ key: 'knight-walk-front', frames: scene.anims.generateFrameNumbers('knight-walk-front', { start: 0, end: 35 }), frameRate: 24, repeat: 1 });
        }



        if (!has('knight-attack-right')) {
            scene.anims.create({ key: 'knight-attack-right', frames: scene.anims.generateFrameNumbers('knight-attack-right', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        if (!has('knight-attack-left')) {
            scene.anims.create({ key: 'knight-attack-left', frames: scene.anims.generateFrameNumbers('knight-attack-left', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        if (!has('knight-attack-back')) {
            scene.anims.create({ key: 'knight-attack-back', frames: scene.anims.generateFrameNumbers('knight-attack-back', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        if (!has('knight-attack-front')) {
            scene.anims.create({ key: 'knight-attack-front', frames: scene.anims.generateFrameNumbers('knight-attack-front', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }



    }

    update(): void {
        let velocityX = 0;
        let velocityY = 0;

        const speedMultiplier = this.spaceKey.isDown ? 1.7 : 1;

        this.sprite.anims.timeScale = speedMultiplier;

        if (this.cursors.W.isDown && this.cursors.A.isDown) {
            this.lastDirection = 'left';

            velocityX = -this.MOVE_SPEED * speedMultiplier * 0.7071;
            velocityY = -this.MOVE_SPEED * speedMultiplier * 0.7071;
            this.lastDirection = 'left';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-left' : 'knight-walk-left', true);
        } else if (this.cursors.W.isDown && this.cursors.D.isDown) {
            this.lastDirection = 'right';
            velocityX = this.MOVE_SPEED * speedMultiplier * 0.7071;
            velocityY = -this.MOVE_SPEED * speedMultiplier * 0.7071;
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-right' : 'knight-walk-right', true);
        } else if (this.cursors.S.isDown && this.cursors.A.isDown) {
            this.lastDirection = 'left';
            velocityX = -this.MOVE_SPEED * speedMultiplier * 0.7071;
            velocityY = this.MOVE_SPEED * speedMultiplier * 0.7071;
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-left' : 'knight-walk-left', true);
        } else if (this.cursors.S.isDown && this.cursors.D.isDown) {
            this.lastDirection = 'right';
            velocityX = this.MOVE_SPEED * speedMultiplier * 0.7071;
            velocityY = this.MOVE_SPEED * speedMultiplier * 0.7071;
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-right' : 'knight-walk-right', true);
        } else if (this.cursors.W.isDown) {
            console.log("W key pressed");
            velocityY = -this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'back';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-back' : 'knight-walk-back', true);
        } else if (this.cursors.S.isDown) {
            console.log("S key pressed");
            velocityY = this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'front';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-front' : 'knight-walk-front', true);
        } else if (this.cursors.A.isDown) {
            console.log("A key pressed");
            velocityX = -this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'left';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-left' : 'knight-walk-left', true);
        } else if (this.cursors.D.isDown) {
            console.log("D key pressed");
            velocityX = this.MOVE_SPEED * speedMultiplier;
            this.lastDirection = 'right';
            this.sprite.play(this.attackKey.isDown ? 'knight-attack-right' : 'knight-walk-right', true);
        }

        if (velocityX === 0 && velocityY === 0) {
            if (this.attackKey.isDown) {
                this.sprite.play(`knight-attack-${this.lastDirection}`, true);
            } else {
                if (this.lastDirection === 'back') {
                    this.sprite.play('knight-idle-right', true);
                } else {
                    this.sprite.play(`knight-idle-${this.lastDirection}`, true);
                }
            }
        }

        // Use physics body velocity instead of manual position updates
        this.sprite.setVelocity(velocityX, velocityY);
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

    getHealth(): number {
        return this.health;
    }

    isDead(): boolean {
        return this.health <= 0;
    }

    damageReceived(): boolean {
        const s = this.sprite
        this.health = this.health - 1
        console.log(this.health)
        s.setTintFill(0xffaaaa)
        s.scene.time.delayedCall(120, () => s.clearTint())
        s.scene.events.emit("health:update", this.health < 0 ? 0 : this.health)
        return true
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