
import { Idle, Move } from "./Command";
import type { ICommand } from "./Command";

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