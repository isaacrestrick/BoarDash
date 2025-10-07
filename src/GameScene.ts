import Phaser from 'phaser';
import { Player } from './Player';
import { NPC } from './Npc';
import {TitleList} from './TitleList';
import { UIGameState } from './gamestate/UIGameState';


export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private npc!: NPC;

  public uiGameState: UIGameState;
  public titleList!: TitleList;
  public foodsList!: TitleList;

  private readonly TILE_SIZE = 32;
  private readonly GRID_WIDTH = 45;
  private readonly GRID_HEIGHT = 33;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('grassy_background', 'grassy_background.png');

    const playerAssets = Player.getRequiredAssets();
    playerAssets.forEach(asset => {
      if (asset.type === 'image') {
        this.load.image(asset.key, asset.path);
      }
    });
  }

  create() {
    const background = this.add.image(0, 0, 'grassy_background');
    background.setOrigin(0, 0);
    background.setDisplaySize(this.GRID_WIDTH * this.TILE_SIZE, this.GRID_HEIGHT * this.TILE_SIZE);

    this.player = new Player(this, 100, 100);
    this.npc = new NPC(this, this.TILE_SIZE * 15, this.TILE_SIZE * 7);

    
    this.uiGameState = new UIGameState()
    this.titleList = new TitleList(
      this,
      ["Titles", ...this.uiGameState.getTitlesList()],
      40,
      40,
      28
    );
    this.foodsList = new TitleList(
      this,
      ["Foods", ...this.uiGameState.getFoodCountsList()],
      this.GRID_WIDTH * this.TILE_SIZE - 40,
      40,
      28,
      'right'
    );
  }


  update() {

    this.player.update();
    this.npc.checkPlayerInteraction(this.player.getX(), this.player.getY());

  }
}