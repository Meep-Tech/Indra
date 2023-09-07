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
};

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
    precedence: number | Number,
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
      precedence: number | Number,
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
      precedence: number | Number,
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
      precedence: number | Number,
      rule: Rule
    ): PrecDynamicToken;
  };
}

/**
 * Creates a blank rule, matching nothing.
 */
declare function blank(): BlankToken;
