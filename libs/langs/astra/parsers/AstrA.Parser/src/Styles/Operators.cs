

namespace Indra.AstrA.Styles {
  /// <summary>
  /// The styles for operators.
  /// </summary>
  public static class Operators {

    /// <summary>
    /// The base style for operators.
    /// </summary>
    public static Token.Style Base { get; } = new() {
      tags = [Token.Style.Tags.Default],
      color = Color.Magenta,
      bold = true,
    };
  }
}
