// import { Accessability } from "./accessability";
// import { Assignments } from "./assignment";

export class Modifiers implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  // readonly modifiers: RuleBuilder<Modifiers & Assignments>
  //   = $ => choice(
  //     $.input_indicator,
  //     $.proc_indicator,
  //     seq(
  //       $.input_indicator,
  //       $.proc_indicator
  //     ),
  //     seq(
  //       $.proc_indicator,
  //       $.input_indicator
  //     )
  //   )

  // readonly _lone_input_indicator: RuleBuilder<Modifiers & Accessability>
  //   = $ => alias(
  //     $._input_indicator,
  //     $.input_indicator
  //   )

  // readonly input_indicator: RuleBuilder<Modifiers & Accessability>
  //   = $ => seq(
  //     optional(field('visibility_prefix', $.accesability_affix)),
  //     $._input_indicator,
  //     optional(field('moddability_suffix', $.accesability_affix)),
  //   )
}

export default Modifiers;