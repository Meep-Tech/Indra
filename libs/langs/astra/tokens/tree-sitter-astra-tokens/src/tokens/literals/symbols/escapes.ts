export class Escapes extends RuleSet {
  static readonly ESCAPE_PREFIX = '\\';

  readonly escape_prefix: () => ImmediateToken<string>
    = () => token.immediate(Escapes.ESCAPE_PREFIX);
}

export default Escapes;

declare global {
  function esc(char: string): SeqToken;
}

globalThis.esc = function esc(char: string) {
  return seq(
    alias(token.immediate(Escapes.ESCAPE_PREFIX), 'escape_prefix'),
    field(KEYS.VALUE, alias(token.immediate(char), 'escape_character')),
  );
}
