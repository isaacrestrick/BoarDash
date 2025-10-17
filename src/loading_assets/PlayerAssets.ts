import Phaser from 'phaser';

interface AssetDefinition {
    key: string;
    path: string;
    type: 'image' | 'spritesheet' | 'audio' | 'json';
    frameWidth?: number;
    frameHeight?: number;
}

export class PlayerAssets {
    static getRequiredAssets(): AssetDefinition[] {
        return [
            { key: 'knight-sprite', path: 'boar_knight/right/Knight-Idle-Right.png', type: 'spritesheet', frameWidth: (1584 / 6), frameHeight: (1506 / 6) },

            {key: 'knight-idle-front', path: 'boar_knight/front/Knight-Idle-Front.png', type: 'spritesheet', frameWidth: (1224 / 6), frameHeight: (1632 / 6) },

            {key: 'knight-idle-left', path: 'boar_knight/left/Knight-Idle-Left.png', type: 'spritesheet', frameWidth: (1584 / 6), frameHeight: (1440 / 6) },

            { key: 'knight-attack-back', path: 'boar_knight/back/Knight-Attack-Back.png', type: 'spritesheet', frameWidth: 432, frameHeight: 361 },
            { key: 'knight-walk-back', path: 'boar_knight/back/Knight-Walk-Back.png', type: 'spritesheet', frameWidth: 174, frameHeight: 274 },
            {
                key: 'knight-attack-front',
                path: 'boar_knight/front/Knight-Attack-Front.png',
                type: 'spritesheet',
                frameWidth: 2520 / 6,
                frameHeight: 1974 / 6
            },
            {
                key: 'knight-walk-front',
                path: 'boar_knight/front/Knight-Walk-Front.png',
                type: 'spritesheet',
                frameWidth: 1104 / 6,
                frameHeight: 1614 / 6
            },
            {
                key: 'knight-attack-left',
                path: 'boar_knight/left/Knight-Attack-Left.png',
                type: 'spritesheet',
                frameWidth: 2568 / 6,
                frameHeight: 2016 / 6
            },
            {
                key: 'knight-walk-left',
                path: 'boar_knight/left/Knight-Walk-Left.png',
                type: 'spritesheet',
                frameWidth: 1638 / 6,
                frameHeight: 1476 / 6
            },
            {
                key: 'knight-attack-right',
                path: 'boar_knight/right/Knight-Attack-Right.png',
                type: 'spritesheet',
                frameWidth: 1902 / 6,
                frameHeight: 1902 / 6
            },
            {
                key: 'knight-walk-right',
                path: 'boar_knight/right/Knight-Walk-Right.png',
                type: 'spritesheet',
                frameWidth: 264,
                frameHeight: 253
            }
        ];
    }

    static registerAnimations(scene: Phaser.Scene): void {
        const has = (key: string) => scene.anims.exists(key);
        
        if (!has('knight-idle')) {
            scene.anims.create({ key: 'knight-idle', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }

        if (!has('knight-idle-right')) {
            scene.anims.create({ key: 'knight-idle-right', frames: scene.anims.generateFrameNumbers('knight-sprite', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }

        if (!has('knight-idle-left')) {
            scene.anims.create({ key: 'knight-idle-left', frames: scene.anims.generateFrameNumbers('knight-idle-left', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }
        
        if (!has('knight-idle-front')) {
            scene.anims.create({ key: 'knight-idle-front', frames: scene.anims.generateFrameNumbers('knight-idle-front', { start: 0, end: 35 }), frameRate: 12, repeat: -1 });
        }

        if (!has('knight-walk-right')) {
            scene.anims.create({ key: 'knight-walk-right', frames: scene.anims.generateFrameNumbers('knight-walk-right', { start: 0, end: 35 }), frameRate: 16, repeat: 1 });
        }
        
        if (!has('knight-walk-left')) {
            scene.anims.create({ key: 'knight-walk-left', frames: scene.anims.generateFrameNumbers('knight-walk-left', { start: 0, end: 35 }), frameRate: 16, repeat: 1 });
        }
        
        if (!has('knight-walk-back')) {
            scene.anims.create({ key: 'knight-walk-back', frames: scene.anims.generateFrameNumbers('knight-walk-back', { start: 0, end: 35 }), frameRate: 24, repeat: 1 });
        }
        
        if (!has('knight-walk-front')) {
            scene.anims.create({ key: 'knight-walk-front', frames: scene.anims.generateFrameNumbers('knight-walk-front', { start: 0, end: 35 }), frameRate: 24, repeat: 1 });
        }

        if (!has('knight-attack-right')) {
            scene.anims.create({ key: 'knight-attack-right', frames: scene.anims.generateFrameNumbers('knight-attack-right', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        
        if (!has('knight-attack-left')) {
            scene.anims.create({ key: 'knight-attack-left', frames: scene.anims.generateFrameNumbers('knight-attack-left', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        
        if (!has('knight-attack-back')) {
            scene.anims.create({ key: 'knight-attack-back', frames: scene.anims.generateFrameNumbers('knight-attack-back', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
        
        if (!has('knight-attack-front')) {
            scene.anims.create({ key: 'knight-attack-front', frames: scene.anims.generateFrameNumbers('knight-attack-front', { start: 0, end: 35 }), frameRate: 30, repeat: 0 });
        }
    }
}

