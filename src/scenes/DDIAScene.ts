import Phaser from 'phaser';

export default class DDIAScene extends Phaser.Scene {
    private readonly GRID_WIDTH = 45;
    private readonly GRID_HEIGHT = 33;
    private readonly TILE_SIZE = 32;

    constructor() {
        super('DDIAScene');
    }

    init(data) {
    }

    preload() {
        this.load.image('ddia', '/ddia.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'ddia').setOrigin(0, 0);

        const targetWidth = this.GRID_WIDTH * this.TILE_SIZE;
        const targetHeight = this.GRID_HEIGHT * this.TILE_SIZE;

        const scaleX = targetWidth / bg.width;
        const scaleY = targetHeight / bg.height;

        // Choose the smaller scale to ensure the whole image fits
        const scale = Math.min(scaleX, scaleY);

        bg.setScale(scale);

        // Optionally center it in the target area
        bg.setPosition(
            (targetWidth - bg.displayWidth) / 2,
            (targetHeight - bg.displayHeight) / 2
        );

        this.time.delayedCall(100, () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }


    update() {}
}