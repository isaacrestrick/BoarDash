import type { Player } from "./Player";

export interface ICommand {
    execute(player: Player): void;
}

const DIAGONAL_MULTIPLIER = Math.SQRT1_2; // 0.7071



export class Move implements ICommand {

    private sign_x: number;
    private sign_y: number;
    private last_direction: string;
    private DIAGONAL: boolean;

    constructor(
        sign_x: number,
        sign_y: number,
        last_direction: string,
        DIAGONAL: boolean = false
    ) {
        this.sign_x = sign_x;
        this.sign_y = sign_y;
        this.last_direction = last_direction;
        this.DIAGONAL = DIAGONAL;
    }
    execute(player: Player): void {
        const speedMultiplier = player.spaceKey.isDown ? 2 : 1;
        player.setLastDirection(this.last_direction);

        player.velocityX =  this.sign_x * player.MOVE_SPEED * speedMultiplier * ((this.DIAGONAL) ? DIAGONAL_MULTIPLIER : 1);
        player.velocityY = this.sign_y * player.MOVE_SPEED * speedMultiplier * ((this.DIAGONAL) ? DIAGONAL_MULTIPLIER : 1);
        
        player.getSprite().play(player.attackKey.isDown ? `knight-attack-${player.getLastDirection()}` : `knight-walk-${player.getLastDirection()}`, true);        player.getSprite().setVelocity(
            player.velocityX, 
            player.velocityY
        );
    }
}

export class Idle implements ICommand {
    execute(player: Player): void {
        if (player.attackKey.isDown) {
            player.sprite.play(`knight-attack-${player.getLastDirection()}`, true);
        } else {
            if (player.getLastDirection() === 'back') {
                player.sprite.play('knight-idle-right', true);
            } else {
                player.sprite.play(`knight-idle-${player.getLastDirection()}`, true);
            }
        }
    }
}







export class MoveCommand implements ICommand {

    private diagonalUpLeft: Move;
    private diagonalUpRight: Move;
    private diagonalBottomLeft: Move;
    private diagonalBottomRight: Move;
    private bottom: Move;
    private up: Move;
    private right: Move;
    private left: Move;
    private idle: Move;


    constructor() {
        this.diagonalUpLeft = new Move(-1, -1, "left", true);
        this.diagonalBottomRight = new Move(1, -1, "right", true);
        this.diagonalBottomLeft = new Move(-1, 1, "left", true);
        this.diagonalUpRight = new Move(1,1, "right", true);
        this.bottom = new Move(0, 1, "front", false);
        this.up = new Move(0, -1, "back", false);
        this.right = new Move(1, 0, "right", false);
        this.left = new Move(-1, 0, "left", false);
        this.idle = new Idle();
    }

    execute(player: Player): void {

        player.velocityX = 0;
        player.velocityY = 0;

        const speedMultiplier = player.spaceKey.isDown ? 2 : 1;

        player.sprite.anims.timeScale = speedMultiplier;

        if (player.cursors.W.isDown && player.cursors.A.isDown) {
            this.diagonalUpLeft.execute(player);
        } else if (player.cursors.W.isDown && player.cursors.D.isDown) {
            this.diagonalBottomRight.execute(player);
        } else if (player.cursors.S.isDown && player.cursors.A.isDown) {
            this.diagonalBottomLeft.execute(player);
        } else if (player.cursors.S.isDown && player.cursors.D.isDown) {
            this.diagonalUpRight.execute(player);
        } else if (player.cursors.W.isDown) {
            this.up.execute(player);
        } else if (player.cursors.S.isDown) {
            this.bottom.execute(player);
        } else if (player.cursors.A.isDown) {
            this.left.execute(player);
        } else if (player.cursors.D.isDown) {
            this.right.execute(player);
        }

        if (player.velocityX === 0 && player.velocityY === 0) {
            this.idle.execute(player);
        }


        player.sprite.setVelocity(player.velocityX, player.velocityY);


        
    }
}