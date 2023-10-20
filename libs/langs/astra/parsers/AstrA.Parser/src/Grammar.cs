




namespace Indra.AstrA {

  /// <summary>
  ///  The <see cref="Parser.Grammar" /> for the AstrA language.
  /// </summary>
  public class Grammar()
    : Grammar<Tokens.Source>("AstrA") {
    /// <inheritdoc />
    public override IEnumerable<(Token.Path matcher, Token.Style style)> styles => [
      ([Token.Type<Tokens.Operator>.Key], Styles.Operators.Base)
    ];
  }
}