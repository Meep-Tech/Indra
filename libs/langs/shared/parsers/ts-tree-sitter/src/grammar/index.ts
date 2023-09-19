export * from './class';

import './config';
import './function';

import Grammar_ from './class'

declare global {
  var Grammar: typeof Grammar_;
  type Grammar<
    TRules extends RuleSetClass,
    TExternals extends ExternalRuleClass,
    TIRules extends InstanceType<TRules> = InstanceType<TRules>,
    TIExternals extends InstanceType<TExternals> = InstanceType<TExternals>
  > = Grammar_<
    TRules,
    TExternals,
    TIRules,
    TIExternals
  >
}

globalThis.Grammar = Grammar_;
