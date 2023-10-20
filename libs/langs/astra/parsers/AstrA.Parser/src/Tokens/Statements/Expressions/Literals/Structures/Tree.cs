namespace Indra.AstrA.Tokens;

/// <summary>
/// A literal representation of a branching, indentation-sensitive structure.
/// </summary>
[Token.Repeat<Branch>]
[Token.Delimited<Rules.Indents.Increase, Rules.Indents.Decrease>]
public class Tree
  : Structure;