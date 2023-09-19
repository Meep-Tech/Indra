import 'ts-tree-sitter';
import Entries from './tokens/entries';

const csv
  = new Grammar({
    name: 'csv',
    rules: [
      Entries
    ]
  });

module.exports = csv;
