namespace Indra.AstrA.Tokens;

/// <summary>
/// An invocation of an entry
/// </summary>
[Token.Splayed]
[Token.Choice<Attribute>]
[Token.Choice<Lookup>]
[Token.Choice<Call>]
[Token.Choice<Operation>]
public class Invocation
  : Expression;