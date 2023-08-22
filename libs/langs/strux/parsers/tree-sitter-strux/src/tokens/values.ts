import { Literals } from "./literals";
import { Maps } from "./maps";
import { Whitespace } from "./symbols";

export class Values implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly _inline_value: RuleBuilder<Literals & Whitespace>
    = $ => seq(
      $.literal,
      // tags and aliases after the value (only allowed inline).
      //optional(field('attributes_after', $._inline_attributes))
    )

  readonly _multiline_value: RuleBuilder<Maps & Literals & Whitespace>
    = $ => prec.right(seq(
      $.indent,
      choice(
        $._multiline_map,
        $.literal
      ),
    ))
}

export default Values;