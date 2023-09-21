import Whitespace from "./whitespace";

export class Sources extends RuleSet {
  readonly src: RuleBuilder<Sources>
    = $ =>
      choice(
        $.command,
        $.file
      );

  readonly file: RuleBuilder<Sources & Whitespace & Motes & Archetypes & Procedurals & Constants>
    = $ => seq(
      pad(
        choice(
          $.archetype,
          $.prototype,
          $.procedural,
          $.mote,
          $.constant
        ),
        repeat($.line_ending)
      ),
      optional($.end_of_file)
    );

  readonly command: RuleBuilder<Procedurals & Statements>
    = $ => seq(
      $.procedural_operator,
      $.statement,
    );
}

export class Archetypes extends RuleSet {
  readonly archetype: RuleBuilder<Archetypes & Whitespace & Motes>
    = $ => seq(

    );
}

export class Motes extends RuleSet {
  readonly mote: RuleBuilder<Motes & Whitespace>
    = $ => seq(
    );
}

export default Sources;
