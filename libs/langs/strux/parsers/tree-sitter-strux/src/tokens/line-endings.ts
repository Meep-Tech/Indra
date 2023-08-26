
export class LineEndings implements ExternalRules {
  readonly [key: string]: Token | undefined;

  readonly _newline_: Token = null!;
  readonly _eol_: Token = null!;
  readonly _eof_: Token = null!;
}
