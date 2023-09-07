import 'colors';

export type DebugSettings = {
  showHiddenRules?: boolean;
  showLogs?: boolean;
  throwErrors?: boolean;
};

export class Grammar<
  TRules extends RuleSetClass,
  TExternals extends ExternalRuleClass,
  TIRules extends InstanceType<TRules> = InstanceType<TRules>,
  TIExternals extends InstanceType<TExternals> = InstanceType<TExternals>
> {
  /** @see Config#name */
  readonly name: string;

  /** @see Config#rules */
  readonly rules: TIRules;

  /** @see Config#externals */
  readonly externals: (($: Rules<TIRules, TIExternals>) => (TIExternals[string])[]) | undefined;

  /** @see Config#extras */
  readonly extras: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#inline */
  readonly inline: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#conflicts */
  readonly conflicts: (($: Rules<TIRules, TIExternals>) => [Rule, Rule]) | undefined;

  /** @see Config#supertypes */
  readonly supertypes: (($: Rules<TIRules, TIExternals>) => Rule[]) | undefined;

  /** @see Config#precedences */
  readonly precedences: (() => string[][]) | undefined;

  /** @see Config#word */
  readonly word: (($: Rules<TIRules, TIExternals>) => Rule) | undefined;

  /** @alias word */
  get words() { return this.word; }

  constructor({
    name, rules, externals, precedences, extras, inline, conflicts, supertypes, word, words, _debug
  }: Readonly<Partial<Omit<Grammar<TRules, TExternals>, 'externals' | 'name' | 'rules'>> & {
    _debug?: boolean | DebugSettings
    name: string;
    rules: TRules[] | [];
    externals?: TExternals[] | [];
  }>) {
    // init debug?
    const debug_showLogs = (_debug === true) || (typeof _debug === 'object' && _debug.showLogs);
    const debug_showHiddenRules = (_debug === true) || (typeof _debug === 'object' && _debug.showHiddenRules);
    const debug_throwErrors = typeof _debug === 'object' && _debug.throwErrors;
    if (_debug) {
      console.error(`Debugging Grammar: ${name} with Settings: ${JSON.stringify({ debug_showLogs, debug_showHiddenRules, debug_throwErrors })}`);
    }

    // init grammar
    this.name = name.toLowerCase();
    log("Compiling Grammar Definition for Language: " + name);

    // compile rules
    log("Compiling Rules for Language: " + name.blue, { rules })
    const allRules = {} as TIRules;
    for (const rule of rules) {
      try {
        log("Building RuleSet: " + (rule?.name ?? 'undefined').blue);
        const ruleSet = new rule();

        for (const key in ruleSet) {
          log(`Checking if RuleSet Propery: ${key.yellow}, is a valid RuleBuilder`);
          if (typeof key === 'string' && ruleSet[key] instanceof Function) {
            const ruleKey = key as keyof TIRules;
            let ruleBuilder = ruleSet[key] as RuleBuilder<any, any>;

            try {
              if (debug_showHiddenRules && key.startsWith("_")) {
                const alias = ('HIDDEN_' + key);
                log(`Adding Hidden Rule: ${rule.name.blue}.${key.yellow} to Grammar as ${alias.yellow}`);

                const currentRule = ruleBuilder.toString();
                const ruleParts = currentRule.split("=>");
                const ruleArgs = ruleParts[0].trim();
                const ruleContent = ruleParts[1].trim();
                const aliasedRule = `${ruleArgs} => alias(\n\t${ruleContent},\n\t$.${alias})`;

                const newRule = new Function("return " + aliasedRule)();
                ruleBuilder = newRule as RuleBuilder<any, any>;
              }

              log(`Adding Rule: ${key.yellow} with RuleBuilder: \n\t`, { ruleBuilder: ruleBuilder.toString().magenta });
              allRules[ruleKey] = ruleBuilder as TIRules[keyof TIRules];
            } catch (e) {
              if (debug_showLogs) {
                log("Unable to parse as a RuleSet: " + (rule?.name ?? 'undefined').red + ", due to Error: " + e!.toString().red, { ruleBuilder: ruleBuilder.toString().magenta });
                if (debug_throwErrors) {
                  throw e;
                }
              }
            }
          }
        }
      } catch (e) {
        if (debug_showLogs) {
          log("Unable to parse as a RuleSetClass: " + (rule?.name ?? 'undefined').red + ", due to Error: " + e!.toString().red, { rule });
          if (debug_throwErrors) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    }

    // compile externals
    let getExternalsLogic = externals === undefined ? "$ => [" : "$ => [\n"
    for (const external of externals ?? []) {
      try {
        log("Building ExternalRules: " + (external?.name ?? 'undefined').cyan);
        const externalSet = new external();

        for (const key in externalSet) {
          log(`Checking if ExternalRules Propery: ${key.yellow}, is a valid Rule`);
          if (!(externalSet[key] instanceof Function)) {
            log(`Adding External: ${external.name.cyan}.${key.yellow} to Grammar`)
            getExternalsLogic += `$.${key},\n`;
          }
        }
      } catch (e) {
        if (debug_showLogs) {
          console.error(
            "Unable to parse as an ExternalRules set: "
            + (external?.name ?? 'undefined').red
            + ", due to Error: "
            + e!.toString().red,
            { external }
          );
          if (debug_throwErrors) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    }

    getExternalsLogic += "]";
    const getExternals = new Function("return " + getExternalsLogic)() as typeof this.externals;
    log("Adding Externals Getter", { getExternals: getExternals!.toString().magenta });

    // set properties
    this.rules = allRules;
    this.externals = getExternals;
    this.precedences = precedences;
    this.extras = extras;
    this.inline = inline;
    this.conflicts = conflicts;
    this.supertypes = supertypes;
    this.word = word ?? words;

    // return grammar
    return grammar(this as any) as any;

    /** @internal */
    function log(text: string, value?: Object) {
      if (debug_showLogs) {
        console.error("GRAMMAR::INIT:: - ".green + text, value ?? "");
      }
    }
  }
}

export default Grammar;
