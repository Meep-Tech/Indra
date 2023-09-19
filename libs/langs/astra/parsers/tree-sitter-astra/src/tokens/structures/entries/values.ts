import { Numbers, Strings, Paragraphs, Empties } from "../../literals";
import Whitespace from "../../whitespace";
import { Arrays } from "../arrays";
import Maps from "../maps";

export class Values extends RuleSet {
  readonly inline_value: RuleBuilder<
    Whitespace
    & Maps
    & Arrays
    & Numbers
    & Strings
    & Paragraphs
    & Empties
  > = $ => seq(
    $.inline_spacing,
    choice(
      $.number,
      $.string,
      $.paragraph,
      $.empty,
      alias($.delimited_map, $.map),
      alias($.delimited_array, $.array),
    ),
    $.line_ending
  );

  readonly child_value: RuleBuilder<
    Maps
    & Arrays
    & Whitespace
    & Numbers
    & Strings
    & Paragraphs
    & Empties
  > = $ => seq(
    $.line_ending,
    $.increase_indent,
    choice(
      $.number,
      $.string,
      $.paragraph,
      $.map,
      $.array,
      $.empty,
    )
  );
}

export default Values;
