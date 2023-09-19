import Whitespace from "../whitespace";
import { Numbers } from "./numbers";

/**
 * StruX Literall Rules related to un-quoted text values.
 *
 * Naked Literals use formatting syntax simiar to Inline Markdown.
 * They also have individual and editable tokens for:
 *   - Components
 *   - Blocks
 *   - Words
 *   - Key Value Pairs
 *   - List Entries, and Sentence Tokens,
 */
export class Paragraphs implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  readonly paragraph: RuleBuilder<Paragraphs> // par
    = $ => choice(
      repeat1(choice(
        $.sentence,
        $.words,
        $.key_value_pair,
      )),
      $.delimited_list
    );

  readonly delimited_list: RuleBuilder<Paragraphs>
    = $ => repeat1(seq(
      // each item before the last should have a seperating comma
      repeat1($.delimited_list_entry),
      // last item has optional trailing ,
      alias(optional($._delimited_list_last_entry), $.delimited_list_entry)
    ));

  readonly delimited_list_entry: RuleBuilder<Paragraphs & Whitespace>
    = $ => seq(
      field(KEYS.VALUE, $._delimited_list_entry_contents),
      optional($.inline_spacing),
      $._delimited_list_entry_seperator,
      optional($.inline_spacing)
    );

  readonly _delimited_list_last_entry: RuleBuilder<Paragraphs>
    = $ => seq(
      field(KEYS.VALUE, $._delimited_list_entry_contents),
      optional($._delimited_list_entry_seperator)
    );

  readonly _delimited_list_entry_contents: RuleBuilder<Paragraphs & Numbers>
    = $ => choice(
      $.words,
      $.key_value_pair,
    );

  readonly _delimited_list_entry_seperator
    = () => /,/;

  readonly sentence: RuleBuilder<Paragraphs>
    = $ => seq(
      field(KEYS.VALUE, choice(
        $.delimited_list,
        $.key_value_pair,
        $.words,
      )),
      $._sentence_ending_punctuation
    )

  readonly key_value_pair: RuleBuilder<Paragraphs>
    = $ => seq(
      field(KEYS.KEY, $.words),
      field(KEYS.OPERATOR, $.key_value_pair_assigner),
      field(KEYS.VALUE, $.words)
    );

  readonly key_value_pair_assigner: RuleBuilder<Paragraphs>
    = $ => choice(
      alias($.key_value_pair_local_assigner, $.local_scope),
      alias($.key_value_pair_file_assigner, $.file_scope)
    );

  readonly key_value_pair_local_assigner: RuleBuilder<Paragraphs>
    = $ => choice(
      alias($.key_value_pair_local_visible_key_assigner, $.visible_key),
      alias($.key_value_pair_local_hidden_key_assigner, $.hidden_key)
    );

  readonly key_value_pair_local_visible_key_assigner: RuleBuilder<Paragraphs>
    = () => token.immediate(/:/);

  readonly key_value_pair_local_hidden_key_assigner: RuleBuilder<Paragraphs>
    = () => token.immediate(/;/);

  readonly key_value_pair_file_assigner: RuleBuilder<Paragraphs>
    = $ => choice(
      alias($.key_value_pair_file_visible_key_assigner, $.visible_key),
      alias($.key_value_pair_file_hidden_key_assigner, $.hidden_key)
    );

  readonly key_value_pair_file_visible_key_assigner: RuleBuilder<Paragraphs>
    = () => token.immediate(/::/);

  readonly key_value_pair_file_hidden_key_assigner: RuleBuilder<Paragraphs>
    = () => token.immediate(/;;/);

  readonly words: RuleBuilder<Paragraphs & Numbers>
    = $ => repeat1(choice($.word, $.number));

  readonly word: RuleBuilder<Paragraphs>
    = $ => seq(
      field(KEYS.VALUE, seq(
        optional($._word_prefix),
        choice(
          $.word_part,
          seq(
            repeat1(seq(
              $.word_part,
              $._word_part_separator
            )),
            $.word_part
          )
        ),
        optional($._word_suffix)
      ))
    );

  readonly _word_prefix
    = () => /[-+~^&=;:]/

  readonly _word_suffix
    = () => /[-+~^&=:;]/

  readonly word_part: RuleBuilder<Paragraphs>
    = $ => choice(
      // single char word part
      $._single_character_word_part,
      $._two_character_word_part,
      $._three_or_more_character_word_part
    );

  readonly _single_character_word_part: RuleBuilder<Paragraphs>
    = $ => choice(
      $._letter,
      $._digit,
      $._word_part_anywhere_symbol,
    );

  readonly _two_character_word_part: RuleBuilder<Paragraphs>
    = $ => seq(
      // first char
      choice(
        $._letter,
        $._digit,
        $._word_part_anywhere_symbol,
      ),
      // last char
      choice(
        $._letter,
        $._digit,
        $._word_part_anywhere_symbol,
      ),
    );

  readonly _three_or_more_character_word_part: RuleBuilder<Paragraphs>
    = $ => seq(
      // first char
      choice(
        $._letter,
        $._digit,
        $._word_part_anywhere_symbol,
      ),
      // middle chars
      repeat1(choice(
        $._letter,
        $._digit,
        $._word_part_anywhere_symbol,
        $._word_part_between_symbol,
      )),
      // last char
      choice(
        $._letter,
        $._digit,
        $._word_part_anywhere_symbol,
      )
    );

  readonly _letter
    = () => token.immediate(/[a-zA-Z]/);

  readonly _digit
    = () => token.immediate(/[0-9]/);

  readonly _word_part_anywhere_symbol
    = () => token.immediate(/[@%"'`_]/);

  readonly _word_part_between_symbol
    = () => token.immediate(/[!?:\(\)]/);

  readonly _sentence_ending_punctuation
    = () => token.immediate(/[?!.]/)

  readonly _word_part_separator
    = () => /[-+/~]/
}
