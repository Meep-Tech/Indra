import { Separators } from "./symbols";
import Whitespace from "../whitespace";
import { Brackets } from "./symbols/brackets";
import Keys from "./entries/keys";
import Values from "./entries/values";

export class Arrays extends RuleSet {
  readonly array: RuleBuilder<Arrays>
    = $ => choice(
      $.delimited_array,
      $.multiline_array,
    );

  readonly delimited_array: RuleBuilder<
    Arrays
    & Whitespace
    & Brackets
  > = $ => seq(
    $.array_start_bracket,
    list(
      pad(
        $.delimited_array_entry,
        optional($.spacing)
      ),
      $.delimited_array_entry_seperator
    ),
    $.array_end_bracket
  );

  readonly delimited_array_entry: RuleBuilder<
    Values
    & Whitespace
  > = $ => pad(
    $.inline_value,
    optional($.spacing),
  );

  readonly delimited_array_entry_seperator: RuleBuilder<Separators>
    = $ => $.explicit_entry_separator;

  readonly multiline_array: RuleBuilder<Arrays & Whitespace>
    = $ => prec.left(list(
      $.multiline_array_entry,
      $.current_indent,
    ));

  readonly multiline_array_entry: RuleBuilder<
    Values
    & Whitespace
    & Keys
  > = $ => seq(
    field(KEYS.KEY, $.ordered_entry_key),
    optional($.inline_spacing),
    seq1(
      $.inline_value,
      $.child_value
    )
  );
}

export default Arrays;
