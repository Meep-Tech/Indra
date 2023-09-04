declare type BlankToken
  = { type: 'BLANK' };

declare type SeqToken
  = { type: 'SEQ'; members: Rule[] };

declare type PlainToken
  = { type: 'TOKEN', content: Rule };

declare type StringToken
  = { type: 'STRING'; value: string };

declare type RepeatToken
  = { type: 'REPEAT'; content: Rule };

declare type PatternToken
  = { type: 'PATTERN'; value: string };

declare type Repeat1Token
  = { type: 'REPEAT1'; content: Rule };

declare type ChoiceToken
  = { type: 'CHOICE'; members: Rule[] };

declare type ExternalToken
  = { type: 'EXTERNAL', content: Rule };

declare type SymbolToken<Name extends string>
  = { type: 'SYMBOL'; name: Name };

declare type ImmediateToken
  = { type: 'IMMEDIATE_TOKEN'; content: Rule };

declare type AliasToken
  = {
    type: 'ALIAS';
    named: boolean;
    content: Rule;
    value: string
  };

declare type FieldToken
  = {
    type: 'FIELD';
    name: string;
    content: Rule
  };

declare type PrecDynamicToken
  = {
    type: 'PREC_DYNAMIC';
    content: Rule;
    value: number
  };

declare type PrecLeftToken
  = {
    type: 'PREC_LEFT';
    content: Rule;
    value: number
  };

declare type PrecRightToken
  = {
    type: 'PREC_RIGHT';
    content: Rule;
    value: number
  };

declare type PrecToken
  = {
    type: 'PREC';
    content: Rule;
    value: number
  };

/**
 * A token with data about what logic to use to handle grammar.
 */
declare type Token
  = PlainToken
  | AliasToken
  | BlankToken
  | ChoiceToken
  | FieldToken
  | ImmediateToken
  | PatternToken
  | PrecDynamicToken
  | PrecLeftToken
  | PrecRightToken
  | PrecToken
  | Repeat1Token
  | RepeatToken
  | SeqToken
  | StringToken
  | SymbolToken<string>;

/**
 * A token or literal used to define a grammar rule.
 */
declare type Rule
  = Token | RegExp | string;

/**
 * A map of external rules.
 */
declare type ExternalRules = Readonly<{
  readonly [key: string]: Token | undefined;
}>

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
 * A function that builds and returns a rule.
 */
declare type RuleBuilder<
  TSources extends RuleSet<any> = any,
  TExternals extends ExternalRules = any
> = ($: Rules<TSources, TExternals>) => Rule;

/**
 * A map of rule names to rule builder functions.
 * - Extend this to define chunks of a grammar.
 */
declare type RuleSet<TExternals extends ExternalRules = ExternalRules> = {
  readonly [key in string]: RuleBuilder<any, TExternals> | undefined
}

declare interface RuleSetClass<TExternals extends ExternalRules = ExternalRules> {
  new(): RuleSet<TExternals>;
}

declare interface ExternalRuleClass {
  new(): ExternalRules;
}

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
    name,
    rules,
    externals,
    precedences,
    extras,
    inline,
    conflicts,
    supertypes,
    word,
    words
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

    const getAllExternals
      = externals === undefined
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

/**
 * Marks the given rule as producing only a single token. Tree-sitter's
 * default is to treat each String or RegExp literal in the grammar as a
 * separate token. Each token is matched separately by the lexer and
 * returned as its own leaf node in the tree. The token function allows
 * you to express a complex rule using the DSL functions (rather
 * than as a single regular expression) but still have Tree-sitter treat
 * it as a single token.
 *
 * @param rule rule to represent as a single token
 */
declare const token: {
  (rule: Rule): PlainToken;

  /**
   * Marks the given rule as producing an immediate token. This allows
   * the parser to produce a different token based on whether or not
   * there are `extras` preceding the token's main content. When there
   * are _no_ leading `extras`, an immediate token is preferred over a
   * normal token which would otherwise match.
   *
   * @param rule rule to represent as an immediate token
   */
  immediate(rule: Rule): ImmediateToken;
}

/**
 * Assigns a field name to the child node(s) matched by the given rule.
 * In the resulting syntax tree, you can then use that field name to
 * access specific children.
 *
 * @param name name of the field
 * @param rule rule the field should match
 */
declare function field(
  name: string,
  rule: Rule
): FieldToken;

/**
 * Creates a rule that matches one of a set of possible rules. The order
 * of the arguments does not matter. This is analogous to the `|` (pipe)
 * operator in EBNF notation.
 *
 * @param options possible rule choices
 */
declare function choice(
  ...rules: Rule[]
): ChoiceToken;

/**
 * Creates a rule that matches any number of other rules, one after another.
 * It is analogous to simply writing multiple symbols next to each other
 * in EBNF notation.
 *
 * @param rules ordered rules that comprise the sequence
 */
declare function seq(
  ...rules: Rule[]
): SeqToken;

/**
 * Creates a rule that matches zero or one occurrence of a given rule.
 * It is analogous to the `[x]` (square bracket) syntax in EBNF notation.
 *
 * @param value rule to be made optional
 */
declare function optional(
  rule: Rule
): ChoiceToken;

/**
 * Creates a rule that matches _zero-or-more_ occurrences of a given rule.
 * It is analogous to the `{x}` (curly brace) syntax in EBNF notation. This
 * rule is implemented in terms of `repeat1` but is included because it
 * is very commonly used.
 *
 * @param rule rule to repeat, zero or more times
 */
declare function repeat(
  rule: Rule
): RepeatToken;

/**
 * Creates a rule that matches one-or-more occurrences of a given rule.
 *
 * @param rule rule to repeat, one or more times
 */
declare function repeat1(
  rule: Rule
): Repeat1Token;

/**
 * Causes the given rule to appear with an alternative name in the syntax tree.
 * For instance with `alias($.foo, 'bar')`, the aliased rule will appear as an
 * anonymous node, as if the rule had been written as the simple string.
 *
 * @param rule rule that will be aliased
 * @param as target or name for the alias
 */
declare function alias(
  rule: Rule,
  as: string | Rule | undefined
): AliasToken;

/**
 * Creates a symbol rule, representing another rule in the grammar by name.
 *
 * @param name name of the target rule
 */
declare function sym<Name extends string>(
  name: Name
): SymbolToken<Name>;

/**
 * Marks the given rule with a precedence which will be used to resolve LR(1)
 * conflicts at parser-generation time. When two rules overlap in a way that
 * represents either a true ambiguity or a _local_ ambiguity given one token
 * of lookahead, Tree-sitter will try to resolve the conflict by matching the
 * rule with the higher precedence.
 *
 * Precedence values can either be strings or numbers. When comparing rules
 * with numerical precedence, higher numbers indicate higher precedences. To
 * compare rules with string precedence, Tree-sitter uses the grammar's `precedences`
 * field.
 *
 * rules is zero. This works similarly to the precedence directives in Yacc grammars.
 *
 * @param value precedence weight
 * @param rule rule being weighted
 *
 * @see https://en.wikipedia.org/wiki/LR_parser#Conflicts_in_the_constructed_tables
 * @see https://docs.oracle.com/cd/E19504-01/802-5880/6i9k05dh3/index.html
 */
declare const prec: {
  (
    precedence: number,
    rule: Rule
  ): PrecToken;

  /**
     * Marks the given rule as left-associative (and optionally applies a
     * numerical precedence). When an LR(1) conflict arises in which all of the
     * rules have the same numerical precedence, Tree-sitter will consult the
     * rules' associativity. If there is a left-associative rule, Tree-sitter
     * will prefer matching a rule that ends _earlier_. This works similarly to
     * associativity directives in Yacc grammars.
     *
     * @param value (optional) precedence weight
     * @param rule rule to mark as left-associative
     *
     * @see https://docs.oracle.com/cd/E19504-01/802-5880/6i9k05dh3/index.html
     */
  left: {
    (
      precedence: number,
      rule: Rule
    ): PrecLeftToken;
    (
      rule: Rule
    ): PrecLeftToken;
  },

  /**
     * Marks the given rule as right-associative (and optionally applies a
     * numerical precedence). When an LR(1) conflict arises in which all of the
     * rules have the same numerical precedence, Tree-sitter will consult the
     * rules' associativity. If there is a right-associative rule, Tree-sitter
     * will prefer matching a rule that ends _later_. This works similarly to
     * associativity directives in Yacc grammars.
     *
     * @param value (optional) precedence weight
     * @param rule rule to mark as right-associative
     *
     * @see https://docs.oracle.com/cd/E19504-01/802-5880/6i9k05dh3/index.html
     */
  right: {
    (
      precedence: number,
      rule: Rule
    ): PrecRightToken;
    (
      rule: Rule
    ): PrecRightToken;
  };

  /**
     * Marks the given rule with a numerical precedence which will be used to
     * resolve LR(1) conflicts at _runtime_ instead of parser-generation time.
     * This is only necessary when handling a conflict dynamically using the
     * `conflicts` field in the grammar, and when there is a genuine _ambiguity_:
     * multiple rules correctly match a given piece of code. In that event,
     * Tree-sitter compares the total dynamic precedence associated with each
     * rule, and selects the one with the highest total. This is similar to
     * dynamic precedence directives in Bison grammars.
     *
     * @param value precedence weight
     * @param rule rule being weighted
     *
     * @see https://www.gnu.org/software/bison/manual/html_node/Generalized-LR-Parsing.html
     */
  dynamic: {
    (
      precedence: number,
      rule: Rule
    ): PrecDynamicToken;
  };
}

/**
 * Creates a blank rule, matching nothing.
 */
declare function blank(): BlankToken;
