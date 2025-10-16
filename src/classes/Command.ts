import type { Player } from "../Player";
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
            player.getSprite().play(`knight-attack-${player.getLastDirection()}`, true);
        } else {
            if (player.getLastDirection() === 'back') {
                player.getSprite().play('knight-idle-right', true);
            } else {
                player.getSprite().play(`knight-idle-${player.getLastDirection()}`, true);
            }
        }
    }
}




