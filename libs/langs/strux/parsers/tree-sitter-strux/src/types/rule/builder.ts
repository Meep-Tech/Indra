/**
 * A function that builds and returns a rule.
 */

declare type RuleBuilder<
  TSources extends RuleSet<any> = any,
  TExternals extends ExternalRules = any
> = ($: Rules<TSources, TExternals>) => Rule;
