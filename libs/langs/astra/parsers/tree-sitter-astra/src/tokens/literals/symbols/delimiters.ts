export class Delimiters extends RuleSet {
  readonly simple_string_delimiter
    = () => token.immediate(/'/);

  readonly template_string_delimiter
    = () => token.immediate(/"/);

  readonly pattern_delimiter
    = () => token.immediate(/`/);
}
