import { Delimiters } from "./symbols/delimiters";
import { Escapes } from "./symbols/escapes";

export class Strings extends RuleSet {
  readonly string: RuleBuilder<Strings>
    = $ => choice(
      $.simple_string, //sst
      $.template_string, //tst
      $.pattern //ptn
    );

  readonly simple_string: RuleBuilder<Strings & Delimiters>
    = $ => delim(
      $.simple_string_delimiter,
      $.string_escape_sequence,
      $.simple_string_text,
    );

  readonly simple_string_text: RuleBuilder<Strings>
    = text("'");

  readonly template_string: RuleBuilder<Strings & Delimiters>
    = $ => delim(
      $.template_string_delimiter,
      $.string_escape_sequence,
      $.template_string_interpolation,
      $.template_string_text,
    );

  readonly template_string_text: RuleBuilder<Strings>
    = text('"');

  readonly pattern: RuleBuilder<Strings & Delimiters>
    = $ => delim(
      $.pattern_delimiter,
      $.pattern_delimiter_escape_sequence,
      $.pattern_text,
    );

  readonly pattern_text: RuleBuilder<Strings>
    = text('`');

  readonly string_escape_sequence: RuleBuilder<
    Escapes
    & Strings
  > = $ => seq(token.immediate(
    $.escape_prefix,
    $.string_escape_character,
  ));

  readonly string_escape_character: RuleBuilder<{}>
    = () => token.immediate(/[\s\S]/);

  readonly pattern_delimiter_escape_sequence: RuleBuilder<Escapes & Delimiters>
    = $ => choice(
      esc($.pattern_delimiter),
      esc($.escape_prefix)
    );

  readonly template_string_interpolation: RuleBuilder<Expressions>
    = $ => $.chained_expression;
}

export default Strings;

declare global {
  function text(delimiter: string): () => ImmediateToken<RegExp>;
}

globalThis.text = function text(delimiter: string): () => ImmediateToken<RegExp> {
  return () => token.immediate(new RegExp(`/[^\\${delimiter}]+/`));
}
