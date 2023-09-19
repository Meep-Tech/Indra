export class Brackets extends RuleSet {
  readonly array_start_bracket: RuleBuilder<{}, {}>
    = () => /\[/;

  readonly array_end_bracket: RuleBuilder<{}, {}>
    = () => /\]/;

  readonly map_start_bracket: RuleBuilder<{}, {}>
    = () => /\{/;

  readonly map_end_bracket: RuleBuilder<{}, {}>
    = () => /\}/;
}

export default Brackets;
