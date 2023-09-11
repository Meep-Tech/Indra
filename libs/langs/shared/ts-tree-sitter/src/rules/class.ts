/**
 * A map of rule names to rule builder functions.
 * - Extend this to define chunks of a grammar.
 */
export class RuleSet<TExternals extends ExternalRules = ExternalRules> {
  readonly [key: string]: RuleBuilder<any, TExternals> | undefined;

  constructor(rules?: { [key: string]: Rule | RuleBuilder<any, TExternals> }) {
    if (rules !== undefined) {
      for (const key in rules) {
        if (!(rules[key] instanceof Function)) {
          (this as { [key: string]: RuleBuilder<any, TExternals> })[key]
            = ((() => rules[key]) as RuleBuilder<any, TExternals>);
        }
      }
    }
  }
}

export default RuleSet;
