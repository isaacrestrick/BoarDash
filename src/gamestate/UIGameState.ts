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

    this.titleScoreAndCountMap = new Map<string, [number, number]>([
      ["Lord of Boars 🐗", [0, 1]],
      ["Slayer of Skeletons 💀", [1, 2]],
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

}

const uiState = new UIGameState();


uiState.addFoodStuff('Ham Sandwiches 🥪');
uiState.addFoodStuff('Ham Sandwiches 🥪');
uiState.addFoodStuff('Apples 🍎');

console.log('Food Counts List:', uiState.getFoodCountsList()); // Should show ['Ham Sandwich x2', 'Apple']


uiState.removeFoodStuff('Ham Sandwiches 🥪');
console.log('Food Counts List after removing one Ham Sandwich:', uiState.getFoodCountsList()); // Should show ['Ham Sandwich', 'Apple']

uiState.removeFoodStuff('Ham Sandwiches 🥪');
console.log('Food Counts List after removing another Ham Sandwich:', uiState.getFoodCountsList()); // Should show ['Apple']

// Test getTitlesList (assuming titleScoreAndCountMap is populated)
if (uiState['titleScoreAndCountMap']) {
  uiState['titleScoreAndCountMap'].set('Slayer of Bandits 💀', [100, 2]);
  uiState['titleScoreAndCountMap'].set('Lord of Boars 🐗', [50, 1]);
  console.log('Titles List:', uiState.getTitlesList()); // Should show ['Slayer of Bandits x2', 'Lord of Boars']
}
