// import { TYPE } from "../keys";

export class Accessability implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;
  // readonly _input_indicator
  //   = () => token.immediate('>');

  // readonly protected_affix
  //   = () => token.immediate('_');

  // readonly internal_affix
  //   = () => token.immediate('__');

  // readonly private_affix
  //   = () => token.immediate('___');

  // readonly accesability_affix: RuleBuilder<Accessability>
  //   = $ => field(TYPE, choice(
  //       $.protected_affix,
  //       $.internal_affix,
  //       $.private_affix,
  //     ));
}

export default Accessability;