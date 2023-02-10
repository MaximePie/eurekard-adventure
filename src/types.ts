export type Member = {
  name: string;
  age: number;
  level: number;
  cost: number;
}
export type Effect = {
  target: string;
  multiplier: number;
}
export type Bonus = {
  name: string;
  cost: number;
  effect: Effect;
  isBought: boolean;
  isAvailable: boolean;
}