export class Literals implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly literal: RuleBuilder<Literals>
    = () => token.immediate(/.*/);
}

export default Literals;