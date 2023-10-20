namespace Indra.AstrA.Tokens;

/// <summary>
/// A statement that assigns a value to a variable.
/// <notes>
/// <li>Results in a Runtime Entry within a Structure.</li>
/// </notes>
/// </summary>
[Token.Splayed]
[Token.Choice<Mutation>]
[Token.Choice<Declaration>]
[Token.Choice<Deconstruction>]
public class Assignment
  : Statement;