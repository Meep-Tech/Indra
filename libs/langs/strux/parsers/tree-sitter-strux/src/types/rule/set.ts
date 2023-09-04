/**
 * A map of rule names to rule builder functions.
 * - Extend this to define chunks of a grammar.
 */
class RuleSet<TExternals extends ExternalRules = ExternalRules> {
  readonly [key: string]: RuleBuilder<any, TExternals> | undefined;

  constructor(rules?: { [key: string]: Rule | RuleBuilder<any, TExternals> }) {
    if (rules !== undefined) {
      for (const key in rules) {
        if (rules[key] instanceof Function) {
          (this as { [key: string]: RuleBuilder<any, TExternals> })[key]
            = (rules[key] instanceof Function
              ? rules[key] as RuleBuilder<any, TExternals>
              : ((() => rules[key]) as RuleBuilder<any, TExternals>));
        }
      }
    }
  }
};

/**
 * A class that defines a set of rules.
 */
declare interface RuleSetClass<TExternals extends ExternalRules = ExternalRules> {
  new(): RuleSet<TExternals>;
}
