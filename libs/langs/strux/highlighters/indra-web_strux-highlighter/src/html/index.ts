import {
  partialSexp,
  fullSexp,
  flattenSexp,
  highlightSexpFromScopes,
  printSexp
} from 'highlight-tree-sitter';
const Grammar: any = {};

const text = `
function foo() {
  return 1;
}`;
const tree = parser.parse(text);

// util to print the literal form of the s-expression
// (js arrays instead of the prettier s-expressions)
import prettier from 'prettier';
const printArray = arr => prettier.format(JSON.stringify(arr), { parser: "json" });

console.log(`
======================================================================
Parsing text:
======================================================================
${text}
`);

const partial = partialSexp(tree);
console.log(`
======================================================================
Partial Tree:
- only named node types are shown
- (no text)
======================================================================

${printSexp(partial)}
`);

const full = fullSexp(text, tree);
console.log(`
======================================================================
Full Tree:
- _root = top level node to catch extra whitespace
- _anon = unnamed node
- (all text is shown as quoted forms)
======================================================================

${printSexp(full)}
`);

const highlight = highlightSexpFromScopes(full, Grammar.scopes);
console.log(`
======================================================================
Highlighted Tree:
======================================================================

CLASSES APPENDED TO NODE NAMES:
${printSexp(highlight.renamedSexp)}

NODES WITHOUT CLASSES FLATTENED:
${printSexp(highlight.sexp)}
`);

console.log(`
======================================================================
HTML:
======================================================================
${highlight.html}
`);