import Phaser from 'phaser'

export class TitleList {
    private scene: Phaser.Scene;
    private titles: string[];
    private textObjects: Phaser.GameObjects.Text[];
    private x: number;
    private y: number;
    private align: 'left' | 'right';
    constructor(scene: Phaser.Scene, titles: string[], x: number = 20, y: number = 20, lineSpacing: number = 28, align: 'left' | 'right' = 'left') {
      this.scene = scene;
      this.titles = titles;
      this.textObjects = [];
      this.align = align
      this.x = x
      this.y = y
  
      this.createText(x, y, lineSpacing, align);
    }
  
    createText(x: number, y: number, lineSpacing: number, align: 'left' | 'right' = 'left'): void {
      this.titles.filter(title => !title.includes('x0')).forEach((title, index) => {
        if (index === 0) {
          const mainTitle = this.scene.add.text(x, y, title, {
            //fontFamily: 'Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold'
          });

          mainTitle.setOrigin(align === 'right' ? 1 : 0, 0);
          this.textObjects.push(mainTitle);
        } else {
          const extraSpacing = 48;
          const txt = this.scene.add.text(
            x, 
            y + extraSpacing + (index - 1) * lineSpacing, 
            title, 
            {
              //fontFamily: 'Arial',
              fontSize: '24px',
              color: '#ffffff'
            }
          );

          txt.setOrigin(align === 'right' ? 1 : 0, 0);
          this.textObjects.push(txt);
        }
      });
    }
  
    updateTitles(newTitles: string[]): void {

      this.textObjects.forEach(obj => obj.destroy());
      this.textObjects = [];
  
      this.titles = newTitles;
      this.createText(this.x, this.y, 28, this.align); 
    }
  }
  