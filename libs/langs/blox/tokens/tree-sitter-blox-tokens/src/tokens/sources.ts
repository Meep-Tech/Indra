import { Sources as AstraSources } from 'tree-sitter-astra-tokens';
import { Sections } from './components/sections';

export class Sources extends AstraSources {
  readonly _src: RuleBuilder<Sources> = $ => $.root;

  readonly root: RuleBuilder<Sections>
    = $ => repeat($.section);
}

export default Sources;
