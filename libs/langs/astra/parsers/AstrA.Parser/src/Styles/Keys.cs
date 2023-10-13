namespace Indra.AstrA.Styles {

  /// <summary>
  /// Styles related to key and identifier tokens
  /// </summary>
  public static class Keys {

    /// <summary>
    /// The base style for keys and identifiers.
    /// </summary>
    public static Token.Style Base { get; } = new() {
      tags = [Token.Style.Tags.Default],
      color = Color.Blue,
    };

    /// <summary>
    /// The style for newly declared keys and identifiers.
    /// </summary>
    public static Token.Style New { get; } = new() {
      @base = Base,
      addedTags = [Token.Style.Tags.Dark],
      brightenBy = 2,
      italic = true,
      variants = [
        new() {
          @base = Base,
          removedTags = [Token.Style.Tags.Dark],
          addedTags = [Token.Style.Tags.Light],
          darkenBy = 1,
        }
      ]
    };

    /// <summary>
    /// The style for existing local keys and identifiers.
    /// </summary>
    public static Token.Style Local { get; } = new() {
      @base = Base
    };

    /// <summary>
    /// Used when a key overrides another key.
    /// </summary>
    public static Token.Style Override { get; } = new() {
      @base = New,
      bold = true,
      color = Base.color,
    };

    /// <summary>
    /// Used when a key is static.
    /// </summary>
    public static Token.Style Static { get; } = new() {
      @base = Base,
      bold = true,
      color = Color.DarkBlue,
    };
  }
}