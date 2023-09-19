import Whitespace from "./whitespace";

export abstract class Sources extends RuleSet {
  abstract readonly _src: RuleBuilder;

  readonly src: RuleBuilder<Sources & Whitespace>
    = $ => seq(
      pad(
        $._src,
        repeat($.line_ending)
      ),
      optional($.end_of_file)
    );
}

export default Sources;
