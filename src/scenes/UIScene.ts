import Phaser from 'phaser';
import { TitleList } from '../TitleList';
import { HealthBar } from '../HealthBar';
import DialogueManager from '../dialogue/DialogueManager';

type UIData = { 
  playerHealth: number,
  titles: string[];
  foods: string[];
};


export default class UIScene extends Phaser.Scene {
    public titleList!: TitleList;
    public foodsList!: TitleList;
    public healthBar: HealthBar;
    public dialogueManager: DialogueManager;
    private readonly TILE_SIZE = 32;
    private readonly GRID_WIDTH = 45;
    private readonly GRID_HEIGHT = 33;

    constructor() { super({ key: 'ui', active: false }); }

  create(data: UIData) {
    // Listen to the gameplay scene’s events
    const game = this.scene.get('GameScene');

    this.titleList = new TitleList(
      this,
      ["Titles", ...data.titles],
      40,
      60,
      28
    );

    this.foodsList = new TitleList(
      this,
      ["Foods", ...data.foods],
      this.GRID_WIDTH * this.TILE_SIZE - 40,
      60,
      28,
      'right'
    );

    this.healthBar = new HealthBar(
      this,
      40,
      15,
      data.playerHealth,
      'left'
    )

    this.dialogueManager = new DialogueManager(this, 0)

    game.events.on('health:update', (health: number) => this.healthBar.updateText(health), this)
    game.events.on('foods:update', (foods: string[]) => this.foodsList.updateTitles(["Foods", ...foods]), this)
    game.events.on('titles:update', (titles: string[]) => this.titleList.updateTitles(["Titles", ...titles]), this)
    game.events.on('dialogue:show', (message: string) => this.dialogueManager.show(message), this)
    
    // UI block clicks
    this.input.setTopOnly(true);

    // handle resize
    this.scale.on('resize', this.layout, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.layout, this);

      game.events.off('health:update', undefined, this);
      game.events.off('foods:update', undefined, this);
      game.events.off('titles:update', undefined, this);
      game.events.off('dialogue:show', undefined, this);
      
    });
  }

  private layout() {}
}
