export class Numbers extends RuleSet {

  readonly number: RuleBuilder<Numbers>
    = $ => seq(
      optional(field(KEYS.OPERATOR, $.negative_sign)),
      $.integer,
      optional(seq(
        $.decimal_point,
        $.integer
      ))
    );

  readonly integer
    = () => token.immediate(/[0-9]+/)

  readonly negative_sign
    = () => token.immediate(/\-/);

  readonly decimal_point
    = () => token.immediate('.');
}

export default Numbers;
