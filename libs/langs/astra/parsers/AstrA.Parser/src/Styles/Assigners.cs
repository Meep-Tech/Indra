

namespace Indra.AstrA.Styles {

  /// <summary>
  /// The styles for assignment operators.
  /// </summary>
  public static class Assigners {

    /// <summary>
    /// The base style for assignment operators.
    /// </summary>
    public static Token.Style Base { get; } = new() {
      @base = Operators.Base,
      addedTags = [Token.Style.Tags.Dark],
      color = Color.PowderBlue,
      variants = [
        new() {
          removedTags = [Token.Style.Tags.Dark],
          addedTags = [Token.Style.Tags.Light],
          color = Color.SlateBlue
        }
      ]
    };

    /// <summary>
    /// The style for procedural assignment operators.
    /// </summary>
    public static Token.Style Procedural { get; } = new() {
      @base = Base,
      bold = true,
      color = Color.Gold
    };
  }
}
