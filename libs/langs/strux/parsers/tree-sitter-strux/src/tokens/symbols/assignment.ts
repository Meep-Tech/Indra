import Whitespace from "../whitespace";

export class Assignments implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  // readonly proc_indicator
  //   = () => token.immediate('>>');

  readonly assignment_operator: RuleBuilder<Whitespace>
    = () => token.immediate(/:/);

  // readonly _trait_indicator
  //   = () => token.immediate('$');
}

export default Assignments;