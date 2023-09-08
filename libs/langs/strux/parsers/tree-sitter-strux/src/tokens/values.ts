import { Literals } from "./literals";
import { Maps } from "./structures/maps";
import { Whitespace } from "./symbols";

export class Values implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly _inline_value: RuleBuilder<Literals & Whitespace>
    = $ => seq(
      /[ \t]+/,
      $._inline_literal,
      $._line_ending
    );

  readonly _child_value: RuleBuilder<Maps & Literals & Whitespace>
    = $ => seq(
      $._line_ending,
      $._increase_indent,
      choice(
        $.map,
        $._inline_literal,
        $._multiline_literal,
      ))
}

export default Values;
