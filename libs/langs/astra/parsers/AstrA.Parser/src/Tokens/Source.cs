namespace Indra.AstrA.Tokens;

/// <summary>
/// A part of the source code of an AstrA program.
/// </summary>
[Token.Splayed]
[Token.Choice<Command>]
[Token.Choice<Event>]
[Token.Choice<File>]
public class Source
  : Token.Type;