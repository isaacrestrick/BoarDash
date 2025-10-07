import Phaser from 'phaser';
import { Player } from './Player';
import { NPC } from './Npc';
import {TitleList} from './TitleList';
import { UIGameState } from './gamestate/UIGameState';
import { Vampire } from './Vampire';

export default class GameScene extends Phaser.Scene {
  private player!: Player;

  public uiGameState: UIGameState;
  public titleList!: TitleList;
  public foodsList!: TitleList;
  private vampireOne!: Vampire;
  private vampireTwo!: Vampire;
  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('grassy_background', 'grassy_background.png');

    // Player assets (spritesheet for knight)
    Player.getRequiredAssets().forEach(asset => {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
      } else if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });

    // Vampire assets
    Vampire.getRequiredAssets().forEach(asset => {
      this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth!, frameHeight: asset.frameHeight! });
    });
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.player = new Player(this, 100, 100);
    
    this.uiGameState = new UIGameState()
    this.titleList = new TitleList(
      this,
      ["Titles", ...this.uiGameState.getTitlesList()],
      40,
      60,
      28
    );
    this.foodsList = new TitleList(
      this,
      ["Foods", ...this.uiGameState.getFoodCountsList()],
      this.GRID_WIDTH * this.TILE_SIZE - 40,
      60,
      28,
      'right'
    );

    // Two vampire NPCs with idle and death animations
    this.vampireOne = new Vampire(this, 700, 300, 2.5);
    this.vampireTwo = new Vampire(this, 300, 300, 2.5);
  }


  update() {

    this.player.update();

    const playerX = this.player.getX();
    const playerY = this.player.getY();

    // Proximity checks handled by base NPC class; death trigger is vampire-specific
    this.vampireOne.checkPlayerInteraction(playerX, playerY);
    this.vampireTwo.checkPlayerInteraction(playerX, playerY);

    if (this.player.isAttacking()) {
      if (this.vampireOne.isPlayerNear()) this.vampireOne.triggerDeath();
      if (this.vampireTwo.isPlayerNear()) this.vampireTwo.triggerDeath();
    }

  }
}