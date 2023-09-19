/**
 * Grammar generation Debug settings.
 */
declare type DebugSettings = {
  showHiddenRules?: boolean;
  showLogs?: boolean;
  throwErrors?: boolean;
  simpleTokenNames?: boolean;
};

/**
 * A configuration object for creating a new Tree-sitter grammar.
 */
declare type Config<TRules extends RuleSet, TExternals extends ExternalRules> = {

  /**
   * Name of the grammar language.
   */
  name: string;

  /**
   * Mapping of grammar rule names to rule builder functions.
   */
  rules: TRules;

  /**
   * An array of arrays of rule names. Each inner array represents a set of
   * rules that's involved in an _LR(1) conflict_ that is _intended to exist_
   * in the grammar. When these conflicts occur at runtime, Tree-sitter will
   * use the GLR algorithm to explore all of the possible interpretations. If
   * _multiple_ parses end up succeeding, Tree-sitter will pick the subtree
   * whose corresponding rule has the highest total _dynamic precedence_.
   *
   * @param $ grammar rules
   */
  conflicts?: ($: Rules<TRules, TExternals>) => Rule[][];

  /**
   * An array of token names which can be returned by an _external scanner_.
   * External scanners allow you to write custom C code which runs during the
   * lexing process in order to handle lexical rules (e.g. Python's indentation
   * tokens) that cannot be described by regular expressions.
   *
   * @param $ grammar rules
   * @param previous array of externals from the base schema, if any
   *
   * @see https://tree-sitter.github.io/tree-sitter/creating-parsers#external-scanners
   */
  externals?: ($: {
    [key in keyof Rules<TRules, TExternals>]: Rule;
  }) => Rule[];

  /**
   * An array of arrays of precedence names. Each inner array represents
   * a *descending* ordering. Names listed earlier in one of these arrays
   * have higher precedence than any names listed later in the same array.
   */
  precidences?: () => string[][];

  /**
   * An array of tokens that may appear anywhere in the language. This
   * is often used for whitespace and comments. The default value of
   * extras is to accept whitespace. To control whitespace explicitly,
   * specify extras: `$ => []` in your grammar.
   *
   *  @param $ grammar rules
   */
  extras?: ($: Rules<TRules, TExternals>) => Rule[];

  /**
   * An array of rules that should be automatically removed from the
   * grammar by replacing all of their usages with a copy of their definition.
   * This is useful for rules that are used in multiple places but for which
   * you don't want to create syntax tree nodes at runtime.
   *
   * @param $ grammar rules
   */
  inline?: ($: Rules<TRules, TExternals>) => Rule[];

  /**
   * A list of hidden rule names that should be considered supertypes in the
   * generated node types file.
   *
   * @param $ grammar rules
   *
   * @see https://tree-sitter.github.io/tree-sitter/using-parsers#static-node-types
   */
  supertypes?: ($: Rules<TRules, TExternals>) => Rule[];

  /**
   * The name of a token that will match keywords for the purpose of the
   * keyword extraction optimization.
   *
   * @param $ grammar rules
   *
   * @see https://tree-sitter.github.io/tree-sitter/creating-parsers#keyword-extraction
   */
  word?: ($: Rules<TRules, TExternals>) => Rule;
};
