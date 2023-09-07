export class Attributes implements RuleSet {
  readonly [key: string]: RuleBuilder | undefined;

  // readonly attributes: RuleBuilder<Attributes & Whitespace> = $ => seq(
  //   $._attribute,
  //   $.newline
  // );

  // readonly _attribute: RuleBuilder<Attributes> = $ => //choice(
  //   $.tag; //,
  // //$.alias,
  // //)

  // readonly tag: RuleBuilder<Attributes & Literals> = $ => seq(
  //   token.immediate('#'),
  //   field(VALUE, $.literal)
  // );

  // readonly _inline_attributes: RuleBuilder<Attributes> = $ => alias(
  //   repeat1($._inline_attribute),
  //   $.attributes
  // );

  // readonly _inline_attribute: RuleBuilder<Attributes> = $ => choice(
  //   $._inline_tag,
  //   $._inline_alias
  // );
}

export default Attributes;
