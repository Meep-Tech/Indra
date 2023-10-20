namespace Indra.AstrA.Tokens;

/// <summary>
/// A statement that returns a value.
/// </summary>
[Token.Splayed]
[Token.Choice<Macro>]
[Token.Choice<Literal>]
[Token.Choice<Invocation>]
public class Expression
  : Statement;