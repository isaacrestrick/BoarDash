
export class CursorManager {
    private scene: Phaser.Scene;
    private cursorHidden: boolean;
    private mouseIdleTimer?: Phaser.Time.TimerEvent;
  
    private static readonly CUSTOM_CURSOR = 'url(/Cursor.png) 16 16, pointer';
    private static readonly MOUSE_IDLE_DELAY = 3000;
  
    constructor(scene: Phaser.Scene) {
      this.scene = scene;
      this.cursorHidden = false;

      this.showCursor();
      this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerActivity, this);
      this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerActivity, this);
      this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerActivity, this);
      this.resetMouseIdleTimer();
  
      this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.clearMouseIdleTimer();
        this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerActivity, this);
        this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerActivity, this);
        this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.handlePointerActivity, this);
        this.showCursor();
      });

    }
  
    private handlePointerActivity = () => {
      this.showCursor();
      this.resetMouseIdleTimer();
    };
  
    private hideCursor = () => {
      if (this.cursorHidden) {
        return;
      }
  
      this.scene.input.setDefaultCursor('none');
      this.cursorHidden = true;
      this.mouseIdleTimer = undefined;
    };
  
  
    public checkToShowCursor = () : boolean => {
      return this.cursorHidden && this.scene.input.activePointer.velocity.lengthSq() > 0
    }
  
    public showCursor = () => {
      this.scene.input.setDefaultCursor(CursorManager.CUSTOM_CURSOR);
      this.cursorHidden = false;
    };
  
    public resetMouseIdleTimer = () => {
      this.clearMouseIdleTimer();
      this.mouseIdleTimer = this.scene.time.delayedCall(CursorManager.MOUSE_IDLE_DELAY, this.hideCursor);
    };
  
    public clearMouseIdleTimer = () => {
      if (this.mouseIdleTimer) {
        this.mouseIdleTimer.remove(false);
        this.mouseIdleTimer = undefined;
      }
    };
  
    
  }