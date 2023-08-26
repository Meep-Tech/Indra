import { Whitespace } from "./symbols";

export class Literals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly literal: RuleBuilder<Literals>
    = $ => $.inline_literal;

  readonly inline_literal: RuleBuilder<Whitespace>
    = () => /.*/;
}

export default Literals;