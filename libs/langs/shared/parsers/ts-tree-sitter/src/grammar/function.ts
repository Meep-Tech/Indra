/**
 * Creates a new language grammar with the provided schema.
 *
 * @param options grammar options
 */

declare function grammar<
  TRules extends RuleSet<any>,
  TExternals extends ExternalRules
>(
  options: Config<TRules, TExternals>
): TRules | Config<TRules, TExternals>;

/**
 * Extends an existing language grammar with the provided options,
 * creating a new language.
 *
 * @param baseGrammar base grammar schema to extend from
 * @param options grammar options for the new extended language
 */

declare function grammar<
  TRules extends RuleSet<any>,
  TExternals extends ExternalRules
>(
  baseGrammar: TRules | Config<TRules, TExternals>,
  options: Config<TRules, TExternals>
): TRules | Config<TRules, TExternals>;
