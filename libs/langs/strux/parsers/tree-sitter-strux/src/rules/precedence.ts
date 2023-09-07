import { Precs } from "../types/precidence";

export const PRECS = new Precs({
  LOWEST: -2,
  LOWER: -1,
  LOW: -1,
  BASE: 0,
  HIGH: 1,
  HIGHER: 2,
  HIGHEST: 3,
} as const);
