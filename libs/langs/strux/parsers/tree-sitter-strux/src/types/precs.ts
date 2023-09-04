class Prec<TKey extends string, TWeight extends number> {
  constructor(
    readonly key: TKey,
    readonly weight: TWeight = 0 as TWeight,
  ) {
    this.weight ??= 0 as TWeight;
  }
};

type Precs<TPrecs extends Record<string, Prec<any, any>>> = Readonly<{
  readonly [key in keyof TPrecs]: TPrecs[key];
}>;

const Precs = (<TPrecs extends Record<string, number>>(
  precs: TPrecs
): Precs<
  { [key in keyof TPrecs]: key extends string ? Prec<key, TPrecs[key]> : never }
> => {
  const precidences = {} as
    { [key in keyof TPrecs]: key extends string ? Prec<key, TPrecs[key]> : never }

  for (const key in precs) {
    precidences[key] = new Prec(key, precs[key]) as (typeof precidences[typeof key]);
  }

  return Object.freeze(precidences);
}) as unknown as {
  new <TPrecs extends Record<string, Prec<any, any>>>(
    precs: TPrecs | { [key in keyof TPrecs]: TPrecs[key]['weight'] | TPrecs[key] }
  ): Precs<TPrecs>;
}

declare type PrecGroup
  = Rule[]
  | [startingWeight: number, ...Rule[]]
  | [...Rule[], endingWeight: number]
  | [startingWeight: number, ...Rule[], endingWeight: number]
  | [...Rule[], ...middleWeight: [number, ...Rule[]]];
