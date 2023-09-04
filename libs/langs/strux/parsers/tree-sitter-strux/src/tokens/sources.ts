import Literals from "./literals";
import { Structs } from "./structures";
import Whitespace from "./whitespace";

export class Sources implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly src: RuleBuilder<Structs & Literals & Whitespace>
    = $ => seq(
      // padding
      repeat($._line_ending),
      // content
      choice(
        // data structure
        $._struct,
        // lone literal
        $._inline_literal,
        // empty
        $._multiline_empty,
        alias($._end_of_file, $.empty)
      ),
      // padding
      optional(seq(
        repeat($._line_ending),
        $._end_of_file
      ))
    );
}

export default Sources;
