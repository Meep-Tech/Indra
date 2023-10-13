


namespace Indra.AstrA {
  namespace Tokens.Statements {
    /// <summary>
    /// A new instance of a value.
    /// </summary>
    public class Literal : Token.Type, Token.ISplayed {
      /// <inheritdoc />
      public static TokenTypesFetcher TYPES
        => _ => _
          ._<Literals.Struct>()
          ._<Literals.Primitive>();
    }
  }
}
