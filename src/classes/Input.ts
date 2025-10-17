import { Input } from "phaser";

export class InputHandler {
    private cursors: { W: Input.Keyboard.Key; A: Input.Keyboard.Key; S: Input.Keyboard.Key; D: Input.Keyboard.Key };
    private spaceKey: Input.Keyboard.Key;
    private HKey: Input.Keyboard.Key;
    private JKey: Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.cursors = {
            W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };
        this.HKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.JKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    public getPressedKeys() {
        const keys: string[] = [];
        if (this.cursors.W.isDown) keys.push("W");
        if (this.cursors.S.isDown) keys.push("S");
        if (this.cursors.A.isDown) keys.push("A");
        if (this.cursors.D.isDown) keys.push("D");
        return keys.join("+");
    }

    public getHKeyPressed() {
        return (this.HKey.isDown)
    }

    public getSpaceKeyPressed() {
        return (this.spaceKey.isDown);
    }

    public getJKeyPressed() {
        return (this.JKey.isDown);
    }

    public getJJustDown() {
        return Phaser.Input.Keyboard.JustDown(this.JKey);
    }
}