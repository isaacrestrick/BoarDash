import Phaser from 'phaser';
import type { Direction } from './PlayerConfig';

export interface IPlayer {
    readonly MOVE_SPEED: number;
    getSprite(): Phaser.Physics.Arcade.Sprite;
    getLastDirection(): Direction;
    setLastDirection(direction: Direction): void;
    setVelocity(velocity: { X: number, Y: number }): void;
}

