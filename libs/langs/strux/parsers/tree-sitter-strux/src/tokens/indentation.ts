export class Indentation implements ExternalRules {
  readonly [key: string]: Token | undefined;

  readonly _indent_: Token = null!;
  readonly _dedent_: Token = null!;
  readonly _samedent_: Token = null!;
  readonly _newline_: Token = null!;
}

export default Indentation;