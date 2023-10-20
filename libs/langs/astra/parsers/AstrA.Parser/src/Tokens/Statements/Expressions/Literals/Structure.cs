namespace Indra.AstrA.Tokens;

/// <summary>
/// A literal representation of a structure.
/// </summary>
[Token.Splayed]
[Token.Choice<Procedural>]
[Token.Choice<Closure>]
[Token.Choice<Tree>]
public class Structure
  : Literal;