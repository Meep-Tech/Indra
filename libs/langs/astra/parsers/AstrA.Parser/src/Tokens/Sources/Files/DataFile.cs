namespace Indra.AstrA.Tokens;

/// <summary>
/// A file with a data entry or structure.
/// </summary>
[Token.Filetype("dat.axa")]
[Token.Filetype("data")]
[Token.Container<Expression>]
public class DataFile
  : File;