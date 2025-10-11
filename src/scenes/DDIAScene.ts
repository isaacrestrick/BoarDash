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
        this.input.setDefaultCursor('url(/Cursor.png) 16 16, pointer');

        const targetWidth = this.GRID_WIDTH * this.TILE_SIZE;
        const targetHeight = this.GRID_HEIGHT * this.TILE_SIZE;

        const baseStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Pixel Script',
            color: '#ffffff',
        };

        const contentStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            ...baseStyle,
            fontSize: '48px',
        };

        const createLabel = (
            x: number,
            y: number,
            message: string,
            options?: Partial<Phaser.Types.GameObjects.Text.TextStyle>,
            cornerRadius = 24
        ) => {
            const paddingX = 32;
            const paddingY = 16;

            const text = this.add
                .text(x, y, message, {
                    ...contentStyle,
                    ...options,
                })
                .setOrigin(0.5)
                .setDepth(2);

            const bounds = text.getBounds();
            const rectX = bounds.centerX - bounds.width / 2 - paddingX;
            const rectY = bounds.centerY - bounds.height / 2 - paddingY;
            const rectWidth = bounds.width + paddingX * 2;
            const rectHeight = bounds.height + paddingY * 2;

            const backgroundBox = this.add.graphics();
            backgroundBox.fillStyle(0x444444, 0.5);
            backgroundBox.fillRoundedRect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
            backgroundBox.setDepth(1);

            return { text, backgroundBox };
        };

        const centerX = targetWidth / 2;
        const centerY = targetHeight / 2;

        createLabel(centerX, centerY - targetHeight * 0.4, 'Loading...', {
            fontSize: '72px',
            fontStyle: 'bold',
        });

        const book = this.add.image(centerX, centerY + targetHeight * 0.1, 'ddia').setDepth(0);

        const finalScale = Math.min((targetWidth) / book.width, (targetHeight ) / book.height);
        const initialScale = finalScale * 0.2;

        book.setScale(initialScale);

        this.tweens.add({
            targets: book,
            scale: finalScale,
            duration: 5000,
            ease: 'Sine.easeOut',
        });

        this.time.delayedCall(5000, () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }


    update() {}
}