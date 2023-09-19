import Arrays from "./arrays";
import Maps from "./maps";

export class Structs extends RuleSet {
  readonly _struct: RuleBuilder<Maps & Arrays>
    = $ => choice(
      $.map,
      $.array
    );
}

export default Structs;
