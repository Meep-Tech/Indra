import {
  nbwsps,
  nbwsp_s,
} from "../../rules";
import Indentation from "../indentation";
import { LineEndings } from "../line-endings";

export class Whitespace implements RuleSet<Indentation & LineEndings> {
  readonly [key: string]: RuleBuilder<Whitespace, Indentation & LineEndings> | undefined;

  readonly newline: RuleBuilder<{}, Indentation & LineEndings>
    = $ => $._newline_;

  readonly _nbwsps: RuleBuilder<Whitespace>
    = () => token.immediate(nbwsps);

  readonly _nbwsp_s: RuleBuilder<Whitespace>
    = () => token.immediate(nbwsp_s);

  readonly _current_indent: RuleBuilder<{}, Indentation>
    = $ => $._samedent_;

  readonly _indent: RuleBuilder<{}, Indentation>
    = $ => $._indent_;

  readonly _dedent: RuleBuilder<{}, Indentation>
    = $ => $._dedent_;
}

export default Whitespace;