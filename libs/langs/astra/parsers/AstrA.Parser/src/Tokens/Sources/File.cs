namespace Indra.AstrA.Tokens;

/// <summary>
/// A file containing AstrA code and state-data.
/// </summary>
[Token.Splayed]
[Token.Choice<TraitFile>]
[Token.Choice<DataFile>]
[Token.Choice<ViewFile>]
[Token.Choice<MoteFile>]
public class File
  : Source;