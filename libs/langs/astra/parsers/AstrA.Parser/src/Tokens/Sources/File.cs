


namespace Indra.AstrA {

  namespace Tokens {

    namespace Sources {
      /// <summary>
      /// A file containing AstrA code and state-data.
      /// </summary>
      public class File : Source, Token.ISplayed {
        /// <inheritdoc />
        public new static TokenTypesFetcher TYPES
          => _ => _
            ._<Files.Trait>()
            ._<Files.Data>()
            ._<Files.View>()
            ._<Files.Mote>();
      }
    }
  }
}
