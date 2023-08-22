import Maps from "./maps";

export class Structs implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly _struct: RuleBuilder<Maps>
    = $ => $.map
}

export default Structs;