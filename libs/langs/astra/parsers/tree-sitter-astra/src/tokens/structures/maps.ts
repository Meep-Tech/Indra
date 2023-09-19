import Whitespace from "../whitespace";
import { Separators } from "../symbols";
import { Entries } from "./entries/entries";
import { Brackets } from "./symbols/brackets";

export class Maps extends RuleSet {
  readonly map: RuleBuilder<Maps>
    = $ => choice(
      $.multiline_map,
      $.delimited_map
    );

  readonly multiline_map: RuleBuilder<Maps & Whitespace>
    = $ => prec.left(list(
      $.current_indent,
      $.multiline_map_entry,
    ));

  readonly delimited_map: RuleBuilder<
    Maps
    & Whitespace
    & Entries
    & Brackets
  > = $ => seq(
    $.map_start_bracket,
    list(
      pad($.inline_named_entry, $.spacing),
      $.delimited_map_entry_seperator
    ),
    $.map_end_bracket
  );

  readonly delimited_map_entry_seperator: RuleBuilder<Separators>
    = $ => $.explicit_entry_separator;

  readonly multiline_map_entry: RuleBuilder<
    Maps
    & Whitespace
    & Entries
  > = $ => choice(
    alias(
      $.multiline_named_entry,
      $.named_entry
    ),
    alias(
      $.multiline_ordered_entry,
      $.ordered_entry
    ),
    alias(
      $.multiline_hybrid_entry,
      $.hybrid_entry
    )
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
