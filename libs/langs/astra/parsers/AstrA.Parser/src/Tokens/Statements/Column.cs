namespace Indra.AstrA.Tokens;

/// <summary>
/// A single column of code in a multi-column statement.
/// </summary>
[Token.NotImplemented]
[Token.Repeat]
[Token.Choice<Switch>]
[Token.Choice<Expression>]
[Token.Choice<Assignment>]
[Token.Separator<ColumnSeparator>]
public class Column
  : Statement;