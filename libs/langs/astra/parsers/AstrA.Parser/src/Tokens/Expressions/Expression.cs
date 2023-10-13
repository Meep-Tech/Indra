namespace Indra.AstrA.Tokens {
  /// <summary>
  /// A splayed token representing a type of expression.
  /// </summary>
  public class Expression : Token.Type, Token.ISplayed {
    /// <inheritdoc />
    public static TokenTypesFetcher TYPES
      => _ => _
        ._<Expressions.Closure>()
        ._<Expressions.Macro>()
        ._<Expressions.Literal>()
        ._<Expressions.Chain>()
        ._<Expressions.Branch>()
        ._<Expressions.Markup>()
        ._<Expressions.Invocation>();
  }
}

namespace Indra.AstrA.Tokens.Expressions {
  /// <summary>
  /// A splayed token representing an eclosed set of expressions.
  /// </summary>
  public class Closure : Expression, Token.ISplayed {
    /// <inheritdoc />
    public new static TokenTypesFetcher TYPES
      => _ => _
        ._<Closures.Logical>()
        ._<Closures.Map>()
        ._<Closures.Array>();
  }
}

namespace Indra.AstrA.Tokens.Closures {
  /// <summary>
  /// A splayed token representing a closure of logic expressions.
  /// </summary>
  public class Logical : Expressions.Closure, Token.IDelimited<
    Delimiters.Logical.Open,
    Entry,
    Delimiters.Logical.Close,
    Delimiters.Seperator
  >;

  /// <summary>
  /// A splayed token representing a closure of map expressions.
  /// </summary>
  public class Map : Expressions.Closure, Token.ISplayed {
    /// <inheritdoc />
    public new static TokenTypesFetcher TYPES
      => _ => _
        ._<Maps.Pair>()
        ._<Maps.Map>();
  }

  /// <summary>
  /// A splayed token representing a closure of array expressions.
  /// </summary>
  public class Array : Expressions.Closure, Token.ISplayed {
    /// <inheritdoc />
    public new static TokenTypesFetcher TYPES
      => _ => _
        ._<Arrays.Item>()
        ._<Arrays.Array>();
  }
}
}