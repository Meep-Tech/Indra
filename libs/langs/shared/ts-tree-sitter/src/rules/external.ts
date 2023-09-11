/**
 * A map of external rules.
 */

declare type ExternalRules = Readonly<{
  readonly [key: string]: Token | undefined;
}>;

/**
 * A class that defines a set of external rules
 */
declare interface ExternalRuleClass {
  new(): ExternalRules;
}
