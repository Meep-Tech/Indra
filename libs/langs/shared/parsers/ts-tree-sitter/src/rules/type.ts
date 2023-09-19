// declare interface RuleSet<TExternals extends ExternalRules = ExternalRules> {
//   readonly [key: string]: RuleBuilder<any, TExternals> | undefined;
// }

/**
 * A class that defines a set of rules.
 */
declare interface RuleSetClass<TExternals extends ExternalRules = ExternalRules> {
  new(): RuleSet<TExternals>;
}
