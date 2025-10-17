import Phaser from 'phaser';
import { InputHandler } from '../classes/Input';
import { PlayerAssets } from '../loading_assets/PlayerAssets';
import { PLAYER_CONFIG, type Direction } from './PlayerConfig';
import { HealthComponent } from './HealthComponent';
import { PlayerMovementController } from './PlayerMovementController';
import type { IPlayer } from './PlayerInterface';

export class Player implements IPlayer {
    private sprite: Phaser.Physics.Arcade.Sprite;
    public readonly MOVE_SPEED = PLAYER_CONFIG.MOVE_SPEED;
    private lastDirection: Direction;

    public readonly health: HealthComponent;
    private readonly movement: PlayerMovementController;
    private _velocityX = 0;
    private _velocityY = 0;

    public setVelocity(object : { X : number, Y: number}) {
        this._velocityX = object.X;
        this._velocityY = object.Y;

    }

    public getVelocity() : { X : number, Y: number} {
        return {
            X: this._velocityX,
            Y: this._velocityY
        }
    }

    static getRequiredAssets = PlayerAssets.getRequiredAssets;
    static registerAnimations = PlayerAssets.registerAnimations;

    constructor(scene: Phaser.Scene, x: number, y: number, private inputHandler: InputHandler) { 
        this.sprite = scene.physics.add.sprite(x, y, 'knight-sprite');
        this.sprite.setScale(PLAYER_CONFIG.SCALE);
        this.sprite.setDepth(PLAYER_CONFIG.DEPTH);
        this.lastDirection = 'front';

        // Enable physics collisions
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body!.setSize(
            this.sprite.width * PLAYER_CONFIG.BODY_SIZE_MULTIPLIER, 
            this.sprite.height * PLAYER_CONFIG.BODY_SIZE_MULTIPLIER
        );

        PlayerAssets.registerAnimations(scene);

       
        this.sprite.play('knight-idle');

        this.health = new HealthComponent(this.sprite);
        this.movement = new PlayerMovementController();

    }
    

    update(): void {
        this.setVelocity({ X: 0, Y: 0 });
        this.movement.update(this, this.inputHandler);
        this.getSprite().setVelocity(this._velocityX, this._velocityY);
    }

    getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite;
    }

    getLastDirection(): Direction {
        return this.lastDirection;
    }

    setLastDirection(last_direction: Direction) {
        this.lastDirection = last_direction;
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }

    isAttacking(): boolean {
        return this.inputHandler.getHKeyPressed();
    }

    justPressedFoodKey(): boolean {
        return this.inputHandler.getJJustDown();
    }
}

