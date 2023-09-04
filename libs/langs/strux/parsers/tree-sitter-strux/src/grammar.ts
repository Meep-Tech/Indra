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
  Structs
} from "./tokens";
import {
  Raws,
  Indentation,
  LineEndings,
  EmptySpacing
} from "./tokens/external";

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
