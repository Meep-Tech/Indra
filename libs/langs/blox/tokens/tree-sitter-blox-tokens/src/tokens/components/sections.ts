import { Whitespace, Maps } from "tree-sitter-astra-tokens"

export class Sections extends RuleSet {

  readonly empty_section_contents: RuleBuilder<Whitespace>
    = $ => seq($.line_ending, $.line_ending, $.line_ending);

  readonly empty_spacing_section: RuleBuilder<Sections>
    = $ => field('contents', alias($.empty_section_contents, $.multiline_spacing));

  readonly section: RuleBuilder<Sections>
    = $ => choice(
      $.empty_spacing_section,
      $.headed_section,
    );

  readonly headed_section: RuleBuilder<Sections & Whitespace>
    = $ => seq(
      field('heading', alias($.current_section_heading, $.section_heading)),
      optional(seq(
        repeat1($.line_ending),
        field('meta', $.section_metadata),
        repeat1($.line_ending)
      )),
      field('contents', $.section_contents),
      // allowed empty lines
      repeat($.line_ending)
    )

  readonly child_section: RuleBuilder<Sections & Whitespace>
    = $ => seq(
      field('heading', alias($.child_section_heading, $.section_heading)),
      optional(seq(
        repeat1($.line_ending),
        field('meta', $.section_metadata),
        repeat1($.line_ending)
      )),
      field('contents', $.whitespace),
      // allowed empty lines
      repeat($.line_ending)
    )

  readonly section_contents: RuleBuilder<Sections & Whitespace>
    = $ => choice(
      alias($.empty_section_contents, $.multiline_spacing),
      repeat1(seq(
        $.section_element,
        // allowed empty lines
        repeat($.line_ending)
      ))
    );

  readonly section_element: RuleBuilder<Sections>
    = $ => choice(
      $.child_section,
      $.paragraph,
      $.list,
      $.table,
      $.admonition,
      $.block,
      $.component
    );

  readonly section_metadata: RuleBuilder<Maps>
    = $ => $.inline_map;
}
