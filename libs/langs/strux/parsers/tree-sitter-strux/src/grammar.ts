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

const StruX
  = new Grammar({
    name: 'strux',
    externals: [
      Raws,
      Indentation,
      LineEndings,
      EmptySpacing
    ] as const,
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
    ] as const,
  });

const rules = StruX.rules.;
