import 'colors';

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
    rules: TIRules | (TRules | TIRules)[] | [];
    externals?: TExternals[] | [];
  }>) {
    // init debug
    let {
      _debug_showHiddenRules,
      _debug_showLogs,
      _debug_throwErrors,
      _debug_simpleTokenNames
    }: {
      _debug_showHiddenRules: boolean;
      _debug_showLogs: boolean;
      _debug_throwErrors: boolean;
      _debug_simpleTokenNames: boolean;
    } = _debug_init();

    // init grammar
    this.name = name.toLowerCase();
    _debug_log("Compiling Grammar Definition for Language: " + name);

    // compile rules
    _debug_log("Compiling Rules for Language: " + name.blue, { rules })
    const allRules = {} as TIRules;
    for (const rule of Array.isArray(rules) ? rules : [rules]) {
      try {
        const ruleSet = rule instanceof Function ? new rule() : rule;
        const ruleSetClass = rule instanceof Function ? rule : rule.constructor;
        _debug_log("Building RuleSet: " + (ruleSetClass?.name ?? 'undefined').blue);

        for (const key in ruleSet) {
          _debug_log(`Checking if RuleSet Propery: ${key.yellow}, is a valid RuleBuilder`);
          if (typeof key === 'string' && ruleSet[key] instanceof Function) {
            const ruleKey = key as keyof TIRules;
            let ruleBuilder = ruleSet[key] as RuleBuilder<any, any>;

            try {
              // if it's hidden, see if we're showing hidden/aliased rules.
              if (_debug_showHiddenRules && key.startsWith("_")) {
                let alias = _debug_simpleTokenNames ? `$.HIDDEN${key}` : `$['HIDDEN: ${key}']`

                const currentRule = ruleBuilder.toString();
                const ruleParts = currentRule.split("=>");
                const ruleContent = ruleParts[1].trim();

                // if the rule is already aliased we can't just unhide it... bad things will happen.
                // ... instead we need to swap out the alias
                let aliasedRule: string;
                if (ruleContent.startsWith("alias")) {
                  const contentParts = ruleContent.split(",");
                  const aliasedContent = contentParts.slice(0, -1).join(",");
                  const currentAlias = contentParts[contentParts.length - 1].split(")")[0].split(".")[1];
                  alias = _debug_simpleTokenNames ? `$.${currentAlias}_ALIAS_OF${key}` : `$['${currentAlias} ALIAS_OF:${key}']`;
                  aliasedRule = `$ => ${aliasedContent},\n\t${alias})`
                } else {
                  aliasedRule = `$ => alias(\n\t${ruleContent},\n\t${alias})`;
                }

                _debug_log(`Adding Hidden Rule: ${ruleSetClass.name.blue}.${key.yellow} to Grammar as ${alias.yellow}`);
                try {
                  const newRule = new Function("return " + aliasedRule)();
                  ruleBuilder = newRule as RuleBuilder<any, any>;
                } catch (e) {
                  if (_debug_showLogs) {
                    _debug_log("Unable to parse as a RuleSet: " + (ruleSetClass?.name ?? 'undefined').red + ", due to Error: " + e!.toString().red, {
                      old: "return " + ruleBuilder.toString().magenta,
                      new: "return ".magenta + aliasedRule.magenta
                    });
                    if (_debug_throwErrors) {
                      throw e;
                    }
                  }
                }
              }

              _debug_log(`Adding Rule: ${key.yellow} with RuleBuilder: \n\t`, { ruleBuilder: ruleBuilder.toString().magenta });
              allRules[ruleKey] = ruleBuilder as TIRules[keyof TIRules];
            } catch (e) {
              if (_debug_showLogs) {
                _debug_log("Unable to parse as a RuleSet: " + (ruleSetClass?.name ?? 'undefined').red + ", due to Error: " + e!.toString().red, { ruleBuilder: ruleBuilder.toString().magenta });
                if (_debug_throwErrors) {
                  throw e;
                }
              }
            }
          }
        }
      } catch (e) {
        if (_debug_showLogs) {
          _debug_log("Unable to parse as a RuleSetClass: " + (rule instanceof Function ? rule.name : rule?.constructor?.name ?? 'undefined').red + ", due to Error: " + e!.toString().red, { rule });
          if (_debug_throwErrors) {
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
        _debug_log("Building ExternalRules: " + (external?.name ?? 'undefined').cyan);
        const externalSet = new external();

        for (const key in externalSet) {
          _debug_log(`Checking if ExternalRules Propery: ${key.yellow}, is a valid Rule`);
          if (!(externalSet[key] instanceof Function)) {
            _debug_log(`Adding External: ${external.name.cyan}.${key.yellow} to Grammar`)
            getExternalsLogic += `$.${key},\n`;
          }
        }
      } catch (e) {
        if (_debug_showLogs) {
          console.error(
            "Unable to parse as an ExternalRules set: "
            + (external?.name ?? 'undefined').red
            + ", due to Error: "
            + e!.toString().red,
            { external }
          );
          if (_debug_throwErrors) {
            throw e;
          }
        } else {
          throw e;
        }
      }
    }

    getExternalsLogic += "]";
    const getExternals = new Function("return " + getExternalsLogic)() as typeof this.externals;
    _debug_log("Adding Externals Getter", { getExternals: getExternals!.toString().magenta });

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
    const result = grammar(this as any);
    _debug_log(`Finished Building Tree Sitter Grammar for ${name}.`, { grammar: result })

    return result as typeof this;

    /** @internal */
    function _debug_init() {
      let _debug_showLogs: boolean = false;
      let _debug_showHiddenRules: boolean = false;
      let _debug_throwErrors: boolean = true;
      let _debug_simpleTokenNames: boolean = true;

      if (_debug === true) {
        _debug_showHiddenRules = true;
        _debug_showHiddenRules = true;
        console.error(`Debugging Grammar: ${name} with Settings: ${JSON.stringify({ debug_showLogs: _debug_showLogs, debug_showHiddenRules: _debug_showHiddenRules, debug_throwErrors: _debug_throwErrors })}`);
      } else if (_debug === false) {
        _debug_throwErrors = false;
        _debug_simpleTokenNames = false;
      } else if (typeof _debug === 'object' && _debug !== null) {
        _debug_showLogs = !!_debug.showLogs;
        _debug_showHiddenRules = !!_debug.showHiddenRules;
        _debug_throwErrors = !!_debug.throwErrors;
        _debug_simpleTokenNames = !!_debug.simpleTokenNames;
        console.error(`Debugging Grammar: ${name} with Settings: ${JSON.stringify({ debug_showLogs: _debug_showLogs, debug_showHiddenRules: _debug_showHiddenRules, debug_throwErrors: _debug_throwErrors })}`);
      } else if (process?.env?.TREE_SITTER_DEBUG) {
        _debug_showLogs = true;
        _debug_showHiddenRules = true;
        _debug_throwErrors = false;
        _debug_simpleTokenNames = true;
        console.error(`Debugging Grammar: ${name} with Settings: ${JSON.stringify({ debug_showLogs: _debug_showLogs, debug_showHiddenRules: _debug_showHiddenRules, debug_throwErrors: _debug_throwErrors })}`);
      }

      return {
        _debug_showHiddenRules,
        _debug_showLogs,
        _debug_throwErrors,
        _debug_simpleTokenNames
      };
    }

    /** @internal */
    function _debug_log(text: string, value?: Object) {
      if (_debug_showLogs) {
        console.error("GRAMMAR::INIT:: - ".green + text, value ?? "");
      }
    }
  }
}

export default Grammar;
