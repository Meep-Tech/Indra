
export class LineEndings implements ExternalRules {
  readonly [key: string]: Token | undefined;

  readonly _newline_: Token = null!;
  readonly _line_ending_: Token = null!;
  readonly _end_of_file_: Token = null!;
}
