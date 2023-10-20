namespace Indra.AstrA.Tokens;
#region Statements
#region Expressions
#region Literals

/// <summary>
/// A literal representation of a primitive value.
/// </summary>
[Token.Choice<Number>]
[Token.Choice<String>]
public class Primitive
  : Literal;

#endregion