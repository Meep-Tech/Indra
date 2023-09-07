import { Raws } from "./external/raws";

export class Keys implements RuleSet<Raws> {
  readonly [key: string]: RuleBuilder | undefined;

  readonly name: RuleBuilder<Keys, Raws>
    = $ => $._name_;

  // readonly _name_first_char: RuleBuilder<Keys>
  //   = () => token.immediate(/[^\s$#._>^]/)

  // readonly _name_rest_chars: RuleBuilder<Keys>
  //   = () => token.immediate(/.*/)
}

export default Keys;
