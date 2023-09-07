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
  EmptySpacing
} from "./tokens";
import { Grammar } from "./types";

export const StruX
  = new Grammar({
    name: 'StruX',
    extras: () => [],
    externals: [
      Raws,
      Indentation,
      LineEndings,
      EmptySpacing
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
