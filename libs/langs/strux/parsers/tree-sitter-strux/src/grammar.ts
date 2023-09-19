import {
  Sources,
  Whitespace,
  Assignments,
  Accessability,
  Modifiers,
  Keys,
  Values,
  Literals,
  Attributes,
  Maps,
  Structs,
  Raws,
  Indentation,
  LineEndings,
  EmptySpacing,
  Errors
} from "tree-sitter-strux-tokens";
import { Grammar } from "ts-tree-sitter";

export const StruX
  = new Grammar({
    name: 'StruX',
    externals: [
      Raws,
      Indentation,
      LineEndings,
      EmptySpacing,
      Errors
    ],
    rules: [
      Sources,

      Whitespace,
      Assignments,
      Accessability,
      Modifiers,

      Structs,
      Maps,

      Keys,

      Values,
      Literals,

      Attributes,
    ],
  });

export default StruX;
export {
  StruX as Grammar,
  StruX as GRAMMAR,
}
