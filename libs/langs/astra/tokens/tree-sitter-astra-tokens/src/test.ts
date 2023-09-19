import {
  Indentation,
  LineEndings,
  EmptySpacing,
  Errors
} from "./tokens";

module.exports = new Grammar({
  name: 'StruX',
  externals: [
    Indentation,
    LineEndings,
    EmptySpacing,
    Errors
  ],
  rules: [
    {
      test: () => seq(
        token.immediate(`.#tst:::\n`),
        choice(

        )
      ),
    } as const,
  ],
});
