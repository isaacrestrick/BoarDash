import type { ICommand } from '../classes/Command';
import { InputHandler } from '../classes/Input';
import { Move, Idle } from '../classes/Command';
import type { Direction } from './PlayerConfig';
import type { IPlayer } from './PlayerInterface';

export class PlayerMovementController {
    private moveConfigs: Map<string, ICommand>;
    private animationDirection: Map<string, Direction>;

    constructor() {
        this.moveConfigs = new Map([
            ['W+A', new Move(-1, -1, "left", true)],
            ['W+D', new Move(1, -1, "right", true)],
            ['S+A', new Move(-1, 1, "left", true)],
            ['S+D', new Move(1,1, "right", true)],
            ['W', new Move(0, -1, "back", false)],
            ['A', new Move(-1, 0, "left", false)],
            ['S', new Move(0, 1, "front", false)],
            ['D', new Move(1, 0, "right", false)]
        ])

        this.animationDirection = new Map([
            ['W+A', "left"],
            ['W+D', "right"],
            ['S+A', "left"],
            ['S+D', "right"],
            ['W', "back"],
            ['A', "left"],
            ['S', "front"],
            ['D', "right"]
        ])
    }

    update(Player: IPlayer, inputHandler: InputHandler) {

        const pressedKeys = inputHandler.getPressedKeys();
        const speedMultiplier = inputHandler.getSpaceKeyPressed() ? 2 : 1;

        Player.getSprite().anims.timeScale = speedMultiplier;

        let command = this.moveConfigs.get(pressedKeys) || new Idle();

        let lastDirection = this.animationDirection.get(pressedKeys);

        if (lastDirection) {
            Player.setLastDirection(lastDirection)
        }

        command.execute(Player, inputHandler);

    }
}

