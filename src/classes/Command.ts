import type { Input } from "phaser";
import type { IPlayer } from "../player/PlayerInterface";
import type { InputHandler } from "./Input";
export interface ICommand {
    execute(player: IPlayer, input: InputHandler): void;
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
    execute(player: IPlayer, input: InputHandler): void {
        const speedMultiplier = input.getSpaceKeyPressed() ? 2 : 1;

        let X =  this.sign_x * player.MOVE_SPEED * speedMultiplier * ((this.DIAGONAL) ? DIAGONAL_MULTIPLIER : 1);
        let Y = this.sign_y * player.MOVE_SPEED * speedMultiplier * ((this.DIAGONAL) ? DIAGONAL_MULTIPLIER : 1);


        player.setVelocity({X, Y});
        
        player.getSprite().play(input.getHKeyPressed() ? `knight-attack-${player.getLastDirection()}` : `knight-walk-${player.getLastDirection()}`, true); player.getSprite().setVelocity(
            X, 
            Y
        );
    }
}

export class Idle implements ICommand {
    execute(player: IPlayer, input: InputHandler): void {
        if (input.getHKeyPressed()) {
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




