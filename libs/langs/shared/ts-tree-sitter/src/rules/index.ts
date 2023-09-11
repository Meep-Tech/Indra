export * from './class';

import './builder';
import './dsl';
import './external';
import './rules';
import './token';
import './type';

import RuleSet_ from './class'

declare global {
  var RuleSet: typeof RuleSet_;
  type RuleSet<
    TExternals extends ExternalRules = ExternalRules
  > = RuleSet_<TExternals>;
}

globalThis.RuleSet = RuleSet_;
