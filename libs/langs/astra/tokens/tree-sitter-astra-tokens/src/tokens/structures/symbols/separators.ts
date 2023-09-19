export class Separators extends RuleSet {
  readonly explicit_entry_separator: RuleBuilder<{}, {}>
    = () => /,/;

  readonly explicit_statement_separator: RuleBuilder<{}, {}>
    = () => /;/;
}
