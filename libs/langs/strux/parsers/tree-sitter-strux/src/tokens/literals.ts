import { PRECS } from "../rules/precedence";

export class Literals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly literal: RuleBuilder<Literals>
    = $ => choice(
      $._inline_literal,
      $._multiline_literal
    );

  readonly _multiline_literal: RuleBuilder<Literals>
    = $ => alias(
      $._multiline_empty,
      $.literal
    );

  readonly _inline_literal: RuleBuilder<Literals>
    = $ => alias(
      choice(
        prec(PRECS.HIGH.weight, $._inline_number),
        $._inline_text,
        $._inline_empty,
      ),
      $.literal
    );

  readonly _multiline_empty: RuleBuilder
    = $ => alias(
      token.immediate(/[ \t\n]*/),
      $.empty
    );

  readonly _inline_empty: RuleBuilder
    = $ => alias(
      token.immediate(/[ \t]*/),
      $.empty
    );

  readonly _inline_number: RuleBuilder<Literals>
    = $ => alias(
      seq(
        $._integer,
        optional($._decimal),
      ),
      $.number
    );

  readonly _integer: RuleBuilder
    = $ => alias(
      token.immediate(/[ \t\n]+\-?[0-9]+/),
      $.integer
    );

  readonly _decimal: RuleBuilder
    = $ => alias(
      token.immediate(/.[0-9]+/),
      $.decimal
    );

  readonly _inline_text: RuleBuilder
    = $ => alias(
      token.immediate(/.+/),
      $.text
    );
}

export default Literals;
