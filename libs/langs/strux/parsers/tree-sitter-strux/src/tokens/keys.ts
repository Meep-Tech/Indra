import { Raws } from "./external/raws";

export const TOKEN_KEY_KEY
  = 'key';
export const TOKEN_VALUE_KEY
  = 'value';
export const TOKEN_TYPE_KEY
  = 'type';
export const TOKEN_OPERATOR_KEY
  = 'operator';
export const TOKEN_INDENT_KEY
  = 'indent';

export {
  TOKEN_KEY_KEY as KEY,
  TOKEN_VALUE_KEY as VALUE,
  TOKEN_TYPE_KEY as TYPE,
  TOKEN_OPERATOR_KEY as OPERATOR,
  TOKEN_INDENT_KEY as INDENT,
}

export class Keys implements RuleSet<Raws> {
  readonly [key: string]: RuleBuilder | undefined;

  readonly name: RuleBuilder<Keys, Raws>
    = $ => $._name_;

  // readonly _name_first_char: RuleBuilder<Keys>
  //   = () => token.immediate(/[^\s$#._>^]/)

  // readonly _name_rest_chars: RuleBuilder<Keys>
  //   = () => token.immediate(/.*/)
}

export default Keys;
