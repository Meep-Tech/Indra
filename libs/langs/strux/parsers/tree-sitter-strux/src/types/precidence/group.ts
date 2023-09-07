declare type PrecGroup
  = Rule[]
  | [startingWeight: number, ...rules: Rule[]]
  | [...rules: Rule[], endingWeight: number]
  | [startingWeight: number, ...rules: Rule[], endingWeight: number]
  | [...rules: Rule[], ...rest: [middleWeight: number, ...rules: Rule[]]];
