import { Assignments } from "../symbols";
import Whitespace from "../../whitespace";
import Keys from "./keys";
import Maps from "../maps";
import Values from "./values";

export class Entries extends RuleSet {

  readonly multiline_hybrid_entry: RuleBuilder<
    Maps
    & Values
    & Keys
    & Assignments
  > = $ => seq(
    field(KEYS.KEY, seq($.ordered_entry_key, $.name)),
    field(KEYS.OPERATOR, $.assignment_operator),
    field(KEYS.VALUE, choice(seq1(
      $.inline_value,
      $.child_value
    )))
  );

  readonly multiline_named_entry: RuleBuilder<
    Assignments
    & Values
    & Keys
    & Maps
  > = $ => seq(
    field(KEYS.KEY, $.name),
    field(KEYS.OPERATOR, $.assignment_operator),
    field(KEYS.VALUE, choice(seq1(
      $.inline_value,
      $.child_value
    )))
  );

  readonly multiline_ordered_entry: RuleBuilder<
    Assignments
    & Values
    & Keys
    & Maps
  > = $ => seq(
    field(KEYS.KEY, $.ordered_entry_key),
    field(KEYS.VALUE, choice($.inline_value))
  );

  readonly inline_named_entry: RuleBuilder<
    Maps
    & Values
    & Whitespace
    & Assignments
    & Keys
  > = $ => seq(
    $.spacing,
    seq(
      field(KEYS.KEY, $.name),
      field(KEYS.OPERATOR, $.assignment_operator),
      field(KEYS.VALUE, choice(
        $.inline_value,
        $.child_value
      ))
    )
  );
}

export default Entries;
