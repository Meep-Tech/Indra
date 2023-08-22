import {
  nbwsps,
  nbwsp_s,
} from "../../rules";
import Indentation from "../indentation";

export class Whitespace implements RuleSet<Indentation> {
  readonly [key: string]: RuleBuilder<any, Indentation> | undefined;

  readonly _newline: RuleBuilder<{}, Indentation>
    = $ => $._newline_;

  readonly _nbwsps: RuleBuilder<Whitespace>
    = () => token.immediate(nbwsps);

  readonly _nbwsp_s: RuleBuilder<Whitespace>
    = () => token.immediate(nbwsp_s);

  readonly current_indent: RuleBuilder<{}, Indentation>
    = $ => $._samedent_;

  readonly indent: RuleBuilder<{}, Indentation>
    = $ => $._indent_;

  readonly _dedent: RuleBuilder<{}, Indentation>
    = $ => $._dedent_;
}

export default Whitespace;