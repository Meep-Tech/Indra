import Whitespace from "./whitespace";

export class Literals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly _multiline_literal: RuleBuilder<Literals>
    = $ => alias($._multiline_empty, $.literal);

  readonly _inline_literal: RuleBuilder<Literals>
    = $ => alias(
      choice(
        $._inline_number,
        $._inline_empty,
        $._inline_text,
      ),
      $.literal
    );

  readonly _multiline_empty: RuleBuilder
    = $ => alias(
      token.immediate(/[ \t\n\r]*/),
      $.empty
    );

  readonly _inline_empty: RuleBuilder
    = $ => alias(
      token.immediate(/[ \t]*/),
      $.empty
    );

  readonly _inline_number: RuleBuilder<Literals>
    = $ => alias(
      choice(
        $._signed_number,
        $._unsigned_number
      ),
      $.number
    );

  readonly _signed_number: RuleBuilder<Literals>
    = $ => prec(1, choice(
      $._signed_decimal,
      $._signed_integer
    ));

  readonly _unsigned_number: RuleBuilder<Literals>
    = $ =>
      choice(
        $._decimal,
        $._integer
      );

  readonly _integer: RuleBuilder<Whitespace & Literals>
    = $ => alias(
      token.immediate(/-?[0-9]+/),
      $.integer
    );

  readonly _signed_integer: RuleBuilder<Whitespace & Literals>
    = $ => alias(
      prec(1, token.immediate(/-?[0-9]+/)),
      $.integer
    );

  readonly _decimal: RuleBuilder<Literals>
    = $ => seq(
      $._integer,
      token.immediate('.'),
      $._integer,
    );

  readonly _signed_decimal: RuleBuilder<Literals>
    = $ => seq(
      $._signed_integer,
      token.immediate('.'),
      $._integer,
    );

  readonly _inline_text: RuleBuilder
    = $ => alias(
      token.immediate(/[^\n\r]+/),
      $.text
    );
}

export default Literals;
