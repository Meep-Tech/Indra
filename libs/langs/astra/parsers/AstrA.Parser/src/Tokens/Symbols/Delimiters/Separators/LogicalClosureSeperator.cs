
namespace Indra.AstrA.Tokens {
}

/// <summary>
/// An optional or explicit seperator.
/// </summary>
public class LogicalClosureSeperator : Token.Type {
  /// <inheritdoc />
  protected override Rule build(Token.Builder _)
    => _.choice(
      _.read(","),
      _.spacing,
      _.repeat.eol.
        _.then.indent.current
    );
}