declare function pad(
  rule: Rule,
  padding: Rule,
  options?: { optional: boolean | [before: boolean, after: boolean] }
): SeqToken;

globalThis.pad
  = (rule: Rule, padding: Rule) => seq(
    padding,
    rule,
    padding,
  );
