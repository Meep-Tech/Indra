import Structs from "./structs";

export class Sources implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly src: RuleBuilder<Structs>
    = $ => $._struct
}

export default Sources;