export class Keys implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly name: RuleBuilder
    = () => /[\S \t]+/;

  readonly ordered_entry_key: RuleBuilder
    = () => / - /;
}

export default Keys;
