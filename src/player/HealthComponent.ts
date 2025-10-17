import Phaser from 'phaser';
import { PLAYER_CONFIG } from './PlayerConfig';

export class HealthComponent {
    private health: number = PLAYER_CONFIG.INITIAL_HEALTH;

    constructor(private sprite: Phaser.Physics.Arcade.Sprite) { 
    }
 
    getHealth(): number {
        return this.health;
    }

    isDead(): boolean {
        return this.health <= 0;
    }

    damageReceived(): boolean {
        const s = this.sprite
        this.health = this.health - 1
        s.setTintFill(PLAYER_CONFIG.DAMAGE_TINT_COLOR)
        s.scene.time.delayedCall(PLAYER_CONFIG.DAMAGE_TINT_DURATION, () => s.clearTint())
        s.scene.events.emit("health:update", this.health < 0 ? 0 : this.health)
        return true
    }
}

