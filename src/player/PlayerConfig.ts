export const PLAYER_CONFIG = {
    // Movement
    MOVE_SPEED: 120,
    SPRINT_MULTIPLIER: 2,
    
    // Sprite
    SCALE: 0.18,
    DEPTH: 1000,
    
    // Physics Body
    BODY_SIZE_MULTIPLIER: 0.07,
    
    // Health
    INITIAL_HEALTH: 10,
    DAMAGE_TINT_COLOR: 0xffaaaa,
    DAMAGE_TINT_DURATION: 120,
} as const;

export type Direction = 'left' | 'right' | 'front' | 'back';

