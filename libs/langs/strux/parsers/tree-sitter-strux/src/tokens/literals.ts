import Whitespace from "./whitespace";

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
      prec.left(choice(
        $._inline_number,
        $._inline_empty,
        prec(-1, $._inline_text),
      )),
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
        $._integer,
        $._signed_integer,
        $._decimal,
      ),
      $.number
    );

  readonly _integer: RuleBuilder<Whitespace & Literals>
    = $ => alias(token.immediate(/[0-9]+/), $.integer);

  readonly _signed_integer: RuleBuilder<Whitespace & Literals>
    = $ => seq(
      field(KEYS.OPERATOR, token.immediate('-')),
      $._integer,
    )

  readonly _decimal: RuleBuilder<Literals>
    = $ => seq(
      $._integer,
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
