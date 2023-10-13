
namespace Indra.AstrA.Tokens.Delimiters {
  namespace Logical {

    /// <summary>
    /// The start of a logical grouping.
    /// </summary>
    public class Start : Token.Type, Token.IConstant {

      /// <inheritdoc />
      public static string PATTERN
        => "(";
    }

    /// <summary>
    /// The end of a logical grouping.
    /// </summary>
    public class End : Token.Type, Token.IConstant {

      /// <inheritdoc />
      public static string PATTERN
        => ")";
    }
  }

  /// <summary>
  /// An optional or explicit seperator.
  /// </summary>
  public class Seperator : Token.Type {
    /// <inheritdoc />
    protected override Rule build(Token.Builder _)
      => _.choice(
        _.read(","),
        _.spacing,
        _.repeat.eol
          .then.indent.current
      );
  }
}