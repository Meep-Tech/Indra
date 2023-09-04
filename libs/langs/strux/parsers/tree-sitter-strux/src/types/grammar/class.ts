class Grammar<
  TRules extends RuleSetClass,
  TExternals extends ExternalRuleClass,
  TIRules extends InstanceType<TRules> = InstanceType<TRules>,
  TIExternals extends InstanceType<TExternals> = InstanceType<TExternals>
> {
  /** @see Config#name */
  readonly name: string;

  /** @see Config#rules */
  readonly rules: TIRules;

  /** @see Config#externals */
  readonly externals: (($: Rules<TIRules, TIExternals>) => (TIExternals[string])[]) | undefined;

  /** @see Config#extras */
  readonly extras: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#inline */
  readonly inline: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#conflicts */
  readonly conflicts: (($: Rules<TIRules, TIExternals>) => [Rule, Rule]) | undefined;

  /** @see Config#supertypes */
  readonly supertypes: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#precedences */
  readonly precedences: (() => string[][]) | undefined;

  /** @see Config#word */
  readonly word: (($: Rules<TIRules, TIExternals>) => Rule) | undefined;

  /** @alias word */
  get words() { return this.word; }

  constructor({
    name, rules, externals, precedences, extras, inline, conflicts, supertypes, word, words
  }: Readonly<Partial<Omit<Grammar<TRules, TExternals>, 'externals' | 'name' | 'rules'>> & {
    name: string;
    rules: TRules[] | [];
    externals?: TExternals[] | [];
  }>) {
    this.name = name.toLowerCase();

    const allRules = {} as TIRules;

    for (const rule of rules) {
      const ruleSet = new rule();
      for (const key in ruleSet) {
        if (ruleSet[key] instanceof Function) {
          allRules[key as keyof TIRules] = ruleSet[key] as TIRules[keyof TIRules];
        }
      }
    }

    this.rules = allRules;

    const getAllExternals = externals === undefined
      ? undefined
      : (() => {
        const allExternals = [] as TIExternals[string][];

        for (const external of externals) {
          const externalSet = new external();

          for (const key in externalSet) {
            if (!(externalSet[key] instanceof Function)) {
              allExternals.push(externalSet[key] as TIExternals[string]);
            }
          }
        }

        return allExternals;
      }) as typeof this['externals'];

    this.externals = getAllExternals;
    this.precedences = precedences;
    this.extras = extras;
    this.inline = inline;
    this.conflicts = conflicts;
    this.supertypes = supertypes;
    this.word = word ?? words;
  }
}
