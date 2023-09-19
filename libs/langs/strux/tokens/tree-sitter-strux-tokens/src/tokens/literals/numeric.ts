import Whitespace from "../whitespace";
import { Literals } from "./literals";


export class NumericLiterals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly number: RuleBuilder<NumericLiterals>
    = $ => seq(
      optional(field(KEYS.OPERATOR, $.negative_sign)),
      $.integer,
      optional(seq(
        $.decimal_point,
        $.integer
      ))
    );

  readonly integer: RuleBuilder<Whitespace & Literals>
    = () => token.immediate(/[0-9]+/)

  readonly negative_sign
    = () => token.immediate(/\-/);

  readonly decimal_point
    = () => token.immediate('.');
}
