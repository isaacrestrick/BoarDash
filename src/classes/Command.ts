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


export class InputHandler {
    private commandMap: Map<string, ICommand>;

    constructor() {
        const diagonalUpLeft = new Move(-1, -1, "left", true);
        const diagonalBottomRight = new Move(1, -1, "right", true);
        const diagonalBottomLeft = new Move(-1, 1, "left", true);
        const diagonalUpRight = new Move(1,1, "right", true);
        const bottom = new Move(0, 1, "front", false);
        const up = new Move(0, -1, "back", false);
        const right = new Move(1, 0, "right", false);
        const left = new Move(-1, 0, "left", false);
        const idle = new Idle();

        this.commandMap = new Map([
            ['W+A', diagonalUpLeft],
            ['W+D', diagonalBottomRight],
            ['S+A', diagonalBottomLeft],
            ['S+D', diagonalUpRight],
            ['W', up],
            ['A', left],
            ['S', bottom],
            ['D', right]
        ])
    }

    private getPressedKeys(player: Player) {
        const keys: string[] = [];
        if (player.cursors.W.isDown) keys.push("W");
        if (player.cursors.S.isDown) keys.push("S");
        if (player.cursors.A.isDown) keys.push("A");
        if (player.cursors.D.isDown) keys.push("D");
        return keys.join("+");
    }

    update(player: Player) {

        player.velocityX = 0;
        player.velocityY = 0;

        const speedMultiplier = player.spaceKey.isDown ? 2 : 1;
        player.getSprite().anims.timeScale = speedMultiplier;

        const pressedKeys = this.getPressedKeys(player);
        let command = this.commandMap.get(pressedKeys) || new Idle();
        command.execute(player);

        player.getSprite().setVelocity(player.velocityX, player.velocityY);

    }
}

