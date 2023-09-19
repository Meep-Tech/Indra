import { Indentation, LineEndings, EmptySpacing } from "./external";

export class Whitespace implements RuleSet<Indentation | LineEndings | EmptySpacing> {
  readonly [key: string]: RuleBuilder<Whitespace, any> | undefined;

  /**
   * Explicit Newline Char Sequence: (one of the following)
   * - \n
   * - \r\n
   * - \n\r
   * - \n\f
   * - \f\n
   */
  readonly newline: RuleBuilder<{}, LineEndings>
    = $ => $._newline_;

  /**
   * Current indent level.
   */
  readonly current_indent: RuleBuilder<{}, Indentation>
    = $ => $._samedent_;

  /**
   * An increase of the indentation before the start of line content. Used for nesting child items.
   * An indentation can be any number of chars, but must stay consistent overall.
   */
  readonly increase_indent: RuleBuilder<{}, Indentation>
    = $ => $._indent_;

  /**
   * A decrease in the indent level back to the previous indent level.
   */
  readonly decrease_indent: RuleBuilder<{}, Indentation>
    = $ => $._dedent_;

  /**
   * Any whitespace leading to (and including) a newline.
   */
  readonly line_ending: RuleBuilder<{}, LineEndings>
    = $ => $._line_ending_;

  /**
   * The explicit EOF
   */
  readonly end_of_file: RuleBuilder<{}, LineEndings>
    = $ => $._end_of_file_;

  /**
   * Whitespace spacing that stays within the current line.
   * - excludes newlines
   */
  readonly inline_spacing: RuleBuilder<{}, EmptySpacing>
    = $ => $._inline_spacing_;

  /**
   * Whitespace of any length including newlines and inline spacing.
   */
  readonly multiline_spacing: RuleBuilder<{}, EmptySpacing>
    = $ => $._multiline_spacing_;

  /**
   * Inline and multiline spacing.
   */
  readonly spacing: RuleBuilder<Whitespace>
    = $ => choice($.inline_spacing, $.multiline_spacing);
}

export default Whitespace;
