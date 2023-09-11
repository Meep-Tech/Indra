/**
 * A set of existing grammar rules.
 * - Use this to get rules from existing RuleSets.
 */
declare type Rules<
  TSets extends RuleSet<any> = RuleSet,
  TExternals extends ExternalRules = ExternalRules
>
  = {
    readonly [key: string]: Rule | undefined
  } & {
    readonly [key in keyof TExternals]: TExternals[key] extends Token
    ? TExternals[key]
    : undefined
  } & {
    readonly [key in keyof TSets]: TSets[key] extends RuleBuilder<any, any>
    ? ReturnType<TSets[key]>
    : undefined
  };

/**
 * A token or literal used to define a grammar rule.
 */
declare type Rule
  = Token | RegExp | string;
