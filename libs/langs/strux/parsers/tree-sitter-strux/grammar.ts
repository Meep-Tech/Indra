import Attributes from "./src/tokens/attributes";
import Keys from "./src/tokens/keys";
import Literals from "./src/tokens/literals";
import Maps from "./src/tokens/maps";
import Sources from "./src/tokens/sources";
import Structs from "./src/tokens/structs";
import Accessability from "./src/tokens/symbols/accessability";
import Assignments from "./src/tokens/symbols/assignment";
import Modifiers from "./src/tokens/symbols/modifiers";
import Whitespace from "./src/tokens/symbols/whitespace";
import Values from "./src/tokens/values";

/**
 * - Token Fields:
 *   - *key*: An identifyable key provided in the toke's text.
 *   - *value*: The main provided value of the token. Usually paired with a *key*.
 *   - *type*: The type/kind/variant/subtype of the token.
 */
module.exports = grammar({
  name: 'strux',

  externals: $ => [
    $._name_,
    $._indent_,
    $._dedent_,
    $._samedent_,
    $._newline_
  ],

  rules: {
    ...new Sources(),

    ...new Whitespace(),
    ...new Assignments(),
    ...new Accessability(),
    ...new Modifiers(),

    ...new Structs(),
    ...new Maps(),

    ...new Keys(),

    ...new Values(),
    ...new Literals(),

    ...new Attributes(),
  }
});