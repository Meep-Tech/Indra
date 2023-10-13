


namespace Indra.AstrA {

  namespace Tokens {
    /// <summary>
    /// The value of an <see cref="Entry"/> in a <see cref="Struct"/>.
    /// </summary>
    public class Value : Token.Type, Token.ISplayed {
      /// <inheritdoc />
      public static TokenTypesFetcher TYPES
        => _ => _
          ._<Values.Literal>()
          ._<Values.Reference>()
          ._<Statement>();
    }
  }
}
