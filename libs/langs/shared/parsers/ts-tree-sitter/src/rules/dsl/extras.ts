// #region Require At Least 1 Sequences

/**
 * Makes a choice token where each choice is a seq of all given rules, but one of the rules in each seq is NOT optional.
 * - This token rule requires at least once element of the sequence, leaving all others optional.
 */
declare function seq1(
  ...rules: Rule[]
): ChoiceToken;

globalThis.seq1 = (...rules: Rule[]) => {
  const variants: Rule[] = [];

  for (const rule of rules) {
    const allOptionalExceptCurrent = rules.map(r => r === rule ? optional(r) : r);
    variants.push(seq(...allOptionalExceptCurrent));
  }

  return choice(...variants)
}

// #endregion

// #region Repeating Lists

/**
 * A list featuring a repeated entry rule, separated by a specified delimiter.
 * Requires at least one element of the rule similar to require1
 */
declare function list(
  entry: Rule,
  delimiter: Rule,
): SeqToken;

globalThis.list = (rule, delimiter) => seq(
  rule,
  repeat(seq(
    delimiter,
    rule
  ))
);

// #endregion

// #region Delimited Sequences

/**
 * A delimiter token that can be used to wrap a sequence of tokens in a delimiter, or set of delimiters.
 */
declare function delim(
  delimiter: Rule,
  ...contents: Rule[]
): SeqToken;
declare function delim(
  delimiters: [start: Rule, end: Rule],
  ...contents: Rule[]
): SeqToken;

globalThis.delim = (delimiter, ...contents) => {
  const contentsRule
    = repeat(Array.isArray(contents)
      ? choice(...contents)
      : contents
    );

  if (Array.isArray(delimiter)) {
    return seq(
      delimiter[0],
      contentsRule,
      delimiter[1]
    );
  } else {
    return seq(
      delimiter,
      contentsRule,
      delimiter
    );
  }
}

// #endregion

// #region Repeating Contents

/**
 * A token that repeats a choice of the given rules.
 */
declare function contents(
  ...rules: Rule[]
): RepeatToken;

declare function contents1(
  ...rules: Rule[]
): Repeat1Token;

globalThis.contents
  = (...rules) => repeat(choice(...rules));

globalThis.contents1
  = (...rules) => repeat1(choice(...rules));

// #endregion
