import Literals from "./literals/literals";
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
        choice(
          $._inline_literal,
          $._multiline_literal
        ),
        // empty
        alias($._end_of_file, $.empty)
      ),
      // padding
      optional(seq(
        repeat($._line_ending),
        optional($._end_of_file)
      ))
    );
}

export default Sources;
