


namespace Indra.AstrA {

  namespace Tokens {
    /// <summary>
    /// The value of an <see cref="Entry"/> in a <see cref="Struct"/>.
    /// </summary>
    public class Value : Token.Type, Token.ISplayed {
      /// <inheritdoc />
      public static TokenTypesFetcher options
        => _ => _
          ._<Values.Literal>()
          ._<Values.Reference>()
          ._<Statement>();
    }
  }
}
