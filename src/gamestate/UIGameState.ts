export class UIGameState {
  private foodCounts: Map<string, number> = new Map<string, number>([
    ["Turkey Sandwiches 🥪", 0],
    ["Kingly Burgers 🍔", 0]
  ]);
  private currentScore: number;
  private titleScoreAndCountMap: Map<string, [number, number]> = new Map<string, [number, number]>([
    ["Lord of Boars 🐗", [0, 1]],
    ["Slayer of Skeletons ☠️", [1, 0]],
    ["Deliverer of Turkey Sandwiches 🥪", [2, 0]],
    ["Favors owed by the king 👑", [3, 0]],
  ]);
  private villagersDelivered: Array<boolean>;

  constructor(foods: Array<string>, titles: Array<string>, villagerCount: number) {
    this.foodCounts = new Map<string, number>(foods.map(food => [food, 0]))
    this.currentScore = 0;
    this.titleScoreAndCountMap = new Map<string, [number, number]>(titles.map((title, idx) => [title, [idx, 0]]));
    this.titleScoreAndCountMap.set("Lord of Boars 🐗", [0, 1])
    this.villagersDelivered = new Array(villagerCount).fill(false);
  }

  getTitleCount(): number {
    let total = 0;
    for (const [, [, count]] of this.titleScoreAndCountMap.entries()) {
      total += count;
    }
    return total;
  }

  setScoreBasedOnTitles(): void {
    let totalScore = 0;
    for (const [, [score, count]] of this.titleScoreAndCountMap.entries()) {
      totalScore += score * count;
    }
    this.currentScore = totalScore;
  }

  getScore(): number {
    return this.currentScore;
  }

  getTitlesList(): string[] {
    const rendered: string[] = [];
    for (const [title, [, count]] of this.titleScoreAndCountMap.entries()) {
      rendered.push(`${title} x${count}`);
    }
    return rendered;
  }

  getFoodCountsList(): string[] {
    const result: string[] = [];
    for (const [food, count] of this.foodCounts.entries()) {
      result.push(`${food} x${count}`);
    }
    return result;
  }

  addFoodStuff(food: string): void {
    if (this.foodCounts.has(food)) {
      this.foodCounts.set(food, this.foodCounts.get(food)! + 1);
    } else {
      this.foodCounts.set(food, 1);
    }
  }

  decrementFoodStuff(food: string): void {
    if (this.foodCounts.has(food)) {
      const currentCount = this.foodCounts.get(food)!;
      if (currentCount > 0) {
        this.foodCounts.set(food, currentCount - 1);
      }
    }
  }

  markVillagerDelivered(villagerId: number): void {
    if (villagerId >= 0 && villagerId < this.villagersDelivered.length) {
      this.villagersDelivered[villagerId] = true;
    }
  }

  allowedToDeliverBurger(): boolean {
    // for (const [title, [score, count]] of this.titleScoreAndCountMap.entries()) {
    //   if (count === 0 && title != "Favors owed by the king 👑") {
    //     console.log(title, count)
    //     return false
    //   }
    // }
    if (!this.villagersDelivered.every(Boolean)) {
      return false;
    }
    return this.titleScoreAndCountMap.get("Slayer of Skeletons ☠️")![1] >= 2;
  }

  incrementTitleCount(title: string): void {
    if (this.titleScoreAndCountMap.has(title)) {
      const [score, count] = this.titleScoreAndCountMap.get(title)!;
      this.titleScoreAndCountMap.set(title, [score, count + 1]);
      this.currentScore += score;
    }
  }

}