namespace Indra.AstrA.Tokens;

/// <summary>
/// A literal representation of a closure structure.
/// </summary>
[Token.Choice<RoundClosure>]
[Token.Choice<SquareClosure>]
[Token.Choice<CurlyClosure>]
public class Closure
  : Structure;