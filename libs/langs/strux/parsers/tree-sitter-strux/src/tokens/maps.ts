import { KEY, Keys, OPERATOR, VALUE } from "./keys";
import { Accessability, Assignments, Whitespace } from "./symbols";
import { Modifiers } from "./symbols/modifiers";
import { Values } from "./values";

export class Maps implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly map: RuleBuilder<Maps>
    = $ => $._multiline_map;

  readonly _multiline_map: RuleBuilder<Maps & Whitespace>
    = $ => repeat1(
      $._multiline_map_entry
    );

  readonly _multiline_map_entry: RuleBuilder<Maps & Whitespace>
    = $ => seq(
      $.current_indent,
      alias(
        $._multiline_map_named_entry,
        $.named_entry
      )
    );

  readonly _multiline_map_named_entry: RuleBuilder<
    Maps &
    Assignments &
    Accessability &
    Keys &
    Modifiers &
    Values
  > = $ => seq(
    field(KEY, $.name),
    field(OPERATOR, $.assignment_operator),
    field(VALUE, choice(
      $._inline_value,
      $._multiline_value
    ))
  );
}

export default Maps;

/*
  readonly _multiline_map_named_entry: RuleBuilder<
    Maps &
    Assignments &
    Accessability &
    Keys &
    Modifiers &
    Values
  > = $ => seq(
    /// LINE BEFORE:
    // tags and aliases on their own lines above the entry.
    //optional(field('attributes_before', $.attributes)),

    /// \n =========== \n

    /// KEY PREFIXES:
    // a prefix indicating this entry is an get-only input property.
    //optional(field('input_prefix', $._lone_input_indicator)),
    // a prefix indicating this entry is an archetype implemented as a trait.
    //optional(field('trait_prefix', $._trait_indicator)),

    // underscores before the name indicate the entry is protected, internal, or private.
    //optional(field('visibility_prefix', $.accesability_affix)),
    // the text-based name of the entry.

    /// KEY:
    field(KEY, $.name),
    // a suffix indicating this entry is an archetype implemented as a trait.

    /// KEY SUFFIXES:
    //optional(field('moddability_suffix', $.accesability_affix)),
    // first colon indicates the end of the name key.
    field(OPERATOR, $.assignment_operator),
    // used to indicate certain properties of the entry.
    //optional(field('modifiers', $.modifiers)),

    // optional aliases after the `:` and before the value.
    // optional(seq(
    //   // space or tab seperating the key from the aliases.
    //   $._nbwsps,
    //   field('aliases_before', $._inline_aliases)
    // )),
    field(VALUE, choice(
      $._inline_value,
      $._multiline_value
    ))
  );
  */