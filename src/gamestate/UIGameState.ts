export class UIGameState {
  private foodCounts: Map<string, number>;
  private currentScore: number;
  private titleScoreAndCountMap: Map<string, [number, number]>;

  constructor() {
    this.foodCounts = new Map<string, number>([
      ["Ham Sandwiches 🥪", 3],
      ["Kingly Burgers 🍔", 1]
    ]);
    this.currentScore = 0;

    // maps to score, count
    this.titleScoreAndCountMap = new Map<string, [number, number]>([
      ["Lord of Boars 🐗", [0, 1]],
      ["Slayer of Vampires 🧛", [1, 0]],
      ["Deliverer of Ham Sandwiches 🥪", [2, 3]],
      ["Favors owed by the king 👑", [3, 4]],
    ]);
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

  removeFoodStuff(food: string): void {
    if (this.foodCounts.has(food)) {
      const currentCount = this.foodCounts.get(food)!;
      if (currentCount > 1) {
        this.foodCounts.set(food, currentCount - 1);
      } else {
        this.foodCounts.delete(food);
      }
    }
  }

  incrementTitleCount(title: string): void {
    if (this.titleScoreAndCountMap.has(title)) {
      const [score, count] = this.titleScoreAndCountMap.get(title)!;
      this.titleScoreAndCountMap.set(title, [score, count + 1]);
    }
  }

}
/*
const uiState = new UIGameState();


uiState.addFoodStuff('Ham Sandwiches 🥪');
uiState.addFoodStuff('Ham Sandwiches 🥪');
uiState.addFoodStuff('Apples 🍎');

console.log('Food Counts List:', uiState.getFoodCountsList());


uiState.removeFoodStuff('Ham Sandwiches 🥪');
console.log('Food Counts List after removing one Ham Sandwich:', uiState.getFoodCountsList());

uiState.removeFoodStuff('Ham Sandwiches 🥪');
console.log('Food Counts List after removing another Ham Sandwich:', uiState.getFoodCountsList());

if (uiState['titleScoreAndCountMap']) {
  uiState['titleScoreAndCountMap'].set('Slayer of Bandits 💀', [100, 2]);
  uiState['titleScoreAndCountMap'].set('Lord of Boars 🐗', [50, 1]);
  console.log('Titles List:', uiState.getTitlesList());
}
*/