import Whitespace from "../whitespace";

export class Empties extends RuleSet {
  readonly empty: RuleBuilder<Whitespace>
    = $ => $.line_ending;
}

export default Empties;
