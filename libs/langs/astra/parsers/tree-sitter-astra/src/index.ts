import 'ts-tree-sitter';
import 'ws-tree-sitter';
import { Sources } from './tokens';

export default new Grammar({
  name: 'astra',
  rules: [
    Sources
  ]
})
