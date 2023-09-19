declare type BlankToken
  = { type: 'BLANK'; };

declare type SeqToken
  = { type: 'SEQ'; members: Rule[]; };

declare type PlainToken
  = { type: 'TOKEN'; content: Rule; };

declare type StringToken
  = { type: 'STRING'; value: string; };

declare type RepeatToken
  = { type: 'REPEAT'; content: Rule; };

declare type PatternToken
  = { type: 'PATTERN'; value: string; };

declare type Repeat1Token
  = { type: 'REPEAT1'; content: Rule; };

declare type ChoiceToken
  = { type: 'CHOICE'; members: Rule[]; };

declare type ExternalToken
  = { type: 'EXTERNAL'; content: Rule; };

declare type SymbolToken<Name extends string>
  = { type: 'SYMBOL'; name: Name; };

declare type ImmediateToken<TType extends RegExp | string = RegExp | string>
  = { type: 'IMMEDIATE_TOKEN'; content: TType; };

declare type AliasToken
  = {
    type: 'ALIAS';
    named: boolean;
    content: Rule;
    value: string;
  };

declare type FieldToken
  = {
    type: 'FIELD';
    name: string;
    content: Rule;
  };

declare type PrecDynamicToken
  = {
    type: 'PREC_DYNAMIC';
    content: Rule;
    value: number;
  };

declare type PrecLeftToken
  = {
    type: 'PREC_LEFT';
    content: Rule;
    value: number;
  };

declare type PrecRightToken
  = {
    type: 'PREC_RIGHT';
    content: Rule;
    value: number;
  };

declare type PrecToken
  = {
    type: 'PREC';
    content: Rule;
    value: number;
  };

/**
 * A token with data about what logic to use to handle grammar.
 */
declare type Token
  = PlainToken |
  AliasToken |
  BlankToken |
  ChoiceToken |
  FieldToken |
  ImmediateToken |
  PatternToken |
  PrecDynamicToken |
  PrecLeftToken |
  PrecRightToken |
  PrecToken |
  Repeat1Token |
  RepeatToken |
  SeqToken |
  ExternalToken |
  StringToken |
  SymbolToken<string>;
