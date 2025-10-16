import { Skeleton } from "../npcs/Skeleton";
import { MageSkeleton } from "../npcs/MageSkeleton";

export class SkeletonManager {
    private _lastSpawnTime = 0;
    private _skeletons: Skeleton[] = [];
    private _skeletonNumber = 12;
    private _skeletonSpawnDelay = 50;
  
  
    private scene: GameScene;
    private spawnAreas: number[][];
  
    constructor(
       scene: GameScene,
      spawnAreas: number[][]
    ) {
      this.scene = scene;
      this.spawnAreas = spawnAreas;
      this.scene.events.on("skeleton:died", (skeleton: Skeleton) => {
        console.log("died")
        const index = this._skeletons.indexOf(skeleton);
        if (index > -1) this._skeletons.splice(index, 1);
      })
    }
  
  
    
    public getLastSpawnTime(): number {
      return this._lastSpawnTime;
    }
    public setLastSpawnTime(value: number): void {
      this._lastSpawnTime = value;
    }
  
    public getSkeletons(): Skeleton[] {
      return this._skeletons;
    }
    public setSkeletons(value: Skeleton[]): void {
      this._skeletons = value;
    }
  
    public getSkeletonNumber(): number {
      return this._skeletonNumber;
    }
    public setSkeletonNumber(value: number): void {
      this._skeletonNumber = value;
    }
  
    public getSkeletonSpawnDelay(): number {
      return this._skeletonSpawnDelay;
    }
    public setSkeletonSpawnDelay(value: number): void {
      this._skeletonSpawnDelay = value;
    }
  
  
    public checkEndGameAndUpdateSkeletonNumber() {
      if (this.scene.uiGameState.allowedToDeliverBurger()) {
        this.setSkeletonNumber(150)
        this.setSkeletonSpawnDelay(50)
        
      } else {
        this.setSkeletonNumber(12)
        this.setSkeletonSpawnDelay(3500)
      }
    }
  
  
    public createSkeletonAtRandomArea(): void {
  
      if (this._skeletons.length < this._skeletonNumber) {
  
        // spawn areas
        const spawnAreas = [
          [425, 430, 75, 35], // position of the center on x, on y, half-width on x, on y 
          [520, 130, 170, 130],
          [1060, 455, 140, 30],
        ]
        const randomArea = spawnAreas[
          Math.floor(Math.random() * spawnAreas.length)
        ]
        const minX = randomArea[0] - randomArea[2]
        const maxX = randomArea[0] + randomArea[2]
        const minY = randomArea[1] - randomArea[3]
        const maxY = randomArea[1] + randomArea[3]
        const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX
        const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY
  
        let now = this.scene.time.now;
  
        if (now - this._lastSpawnTime > this._skeletonSpawnDelay) {
  
          let skeleton = (this.scene.uiGameState.allowedToDeliverBurger()) ? new MageSkeleton(this.scene, x, y, 3.5 / 3.333) : new Skeleton(this.scene, x, y, 3.5 / 3.333)
  
        
            if (this.scene.buildingsLayer) {
              this.scene.physics.add.collider(skeleton.getSprite(), this.scene.buildingsLayer);
            }
          this._skeletons.push(skeleton)
          this._lastSpawnTime = now
        }
        // console.log(minX, minY, maxX, maxY, x, y)
        // console.log(this.lastSpawnTime, this.skeletons.length)
      }
    }
  
  
  
  
  }