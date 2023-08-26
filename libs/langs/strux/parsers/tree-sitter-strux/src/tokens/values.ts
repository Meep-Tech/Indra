import { Literals } from "./literals";
import { Maps } from "./maps";
import { Whitespace } from "./symbols";

export class Values implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly inline_value: RuleBuilder<Literals & Whitespace>
    = $ => $.literal
  // tags and aliases after the value (only allowed inline).
  //optional(field('attributes_after', $._inline_attributes))

  readonly multiline_value: RuleBuilder<Maps & Literals & Whitespace>
    = $ => prec.right(seq(
      $._indent,
      choice(
        $.map,
        $.literal
      ),
    ))
}

export default Values;