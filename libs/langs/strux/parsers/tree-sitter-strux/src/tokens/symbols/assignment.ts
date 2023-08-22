export class Assignments implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly proc_indicator
    = () => token.immediate('>>');

  readonly assignment_operator
    = () => token.immediate(/:\s/);

  readonly _trait_indicator
    = () => token.immediate('$');
}

export default Assignments;