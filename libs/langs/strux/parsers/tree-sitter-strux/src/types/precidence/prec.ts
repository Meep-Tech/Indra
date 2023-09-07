export class Prec<TKey extends string, TWeight extends number> extends Number {
  constructor(
    readonly key: TKey,
    readonly weight: TWeight = 0 as TWeight
  ) {
    super(weight);
    this.weight ??= 0 as TWeight;
  }
}

export default Prec;
