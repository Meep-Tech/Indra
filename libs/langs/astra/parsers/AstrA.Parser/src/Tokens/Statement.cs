namespace Indra.AstrA.Tokens;

/// <summary>
/// A minimum executable segment/chunk of code that may contain other lines and blocks of code.
/// </summary>
[Token.Splayed]
[Token.Choice<Columns>]
[Token.Choice<Switch>]
[Token.Choice<Expression>]
[Token.Choice<Assignment>]
public class Statement
  : Token.Type;