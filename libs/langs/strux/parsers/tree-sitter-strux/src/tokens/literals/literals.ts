import Whitespace from "../whitespace";
import { NakedLiterals } from "./naked";
import { NumericLiterals } from "./numeric";

export class EmptyLiterals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly empty: RuleBuilder<Whitespace>
    = $ => $._line_ending;
}

export class TextLiterals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly text: RuleBuilder<StringLiterals & NakedLiterals>
    = $ => choice(
      $.string,
      $.naked
    )
}

export class StringLiterals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly string: RuleBuilder<StringLiterals & NakedLiterals>
    = $ => choice(
      $.simple_string, //sst
      $.template_string, //tst
      $.pattern //ptn
    )
}

export class Literals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly literal: RuleBuilder<NumericLiterals & EmptyLiterals & TextLiterals>
    = $ => choice(
      $.number,
      $.empty,
      $.text
    );
}
//   = $ => repeat1(
//     choice(
//       seq(
//         /[a-zA-Z]/,
//         repeat(choice(
//           /[a-zA-Z0-9 \t]/,
//           /\.[ \t]/,
//           /[]/
//         )),
//         /[a-zA-Z0-9\.]/
//       )
//     )
//   );

// readonly _letter
//   = () => /[a-zA-Z]/;

// readonly _digit
//   = () => /[0-9]/;

// readonly _word_part_seperator
//   = () => choice(
//     /[-+/.~'"\(\)^_&|%!$@?<>=`:;]/,
//     repeat1(
//       /[-+/.~'"\(\)^_&|%!$@?<>=`:;]/
//     )
//   )

// readonly _word_prefix
//   = () => seq(
//     /[-+:;~^@=_]/,
//     optional(
//       /[/.~'"\(\)^_&|%!$@?<>=`:;]/
//     ),
//   );


// readonly word_suffix_symbols
//   = () => /[-+~^@_]/

// readonly _spacing: RuleBuilder<Whitespace>
//   = $ => choice(
//     /[  \t]/,
//     seq(
//       $._line_ending,
//       $._indent
//     )
//   )
//}

export default Literals;
