namespace Indra.AstrA.Tokens;

/// <summary>
/// A <see cref="Start"/> <see cref="Delimiter"/> for a <see cref="Tree"/>.
/// </summary>
[Token.Choice<Parser.Token<Rules.EndOfFile>>]
public class TreeStartDelimiter
  : Start;

/// <summary>
/// An <see cref="End"/> <see cref="Delimiter"/> for a <see cref="Tree"/>.
/// </summary>
public class TreeEndDelimiter
  : End;
