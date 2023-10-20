namespace Indra.AstrA.Tokens;

/// <summary>
/// A literal representation of a value.
/// </summary>
[Token.Splayed]
[Token.Choice<Structure>]
[Token.Choice<Primitive>]
[Token.Choice<Markup>]
public class Literal
  : Expression;