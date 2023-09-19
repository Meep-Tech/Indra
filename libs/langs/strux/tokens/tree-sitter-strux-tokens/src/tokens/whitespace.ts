import { Indentation, LineEndings, EmptySpacing } from "./external";

export class Whitespace implements RuleSet<Indentation | LineEndings | EmptySpacing> {
  readonly [key: string]: RuleBuilder<{}, any> | undefined;

  readonly _newline: RuleBuilder<{}, LineEndings>
    = $ => $._newline_;

  readonly _current_indent: RuleBuilder<{}, Indentation>
    = $ => $._samedent_;

  readonly _increase_indent: RuleBuilder<{}, Indentation>
    = $ => $._indent_;

  readonly _decrease_indent: RuleBuilder<{}, Indentation>
    = $ => $._dedent_;

  readonly _line_ending: RuleBuilder<{}, LineEndings>
    = $ => $._line_ending_;

  readonly _end_of_file: RuleBuilder<{}, LineEndings>
    = $ => $._end_of_file_;

  readonly _inline_spacing: RuleBuilder<{}, EmptySpacing>
    = $ => $._inline_spacing_;

  readonly _multiline_spacing: RuleBuilder<{}, EmptySpacing>
    = $ => $._multiline_spacing_;
}

export default Whitespace;
