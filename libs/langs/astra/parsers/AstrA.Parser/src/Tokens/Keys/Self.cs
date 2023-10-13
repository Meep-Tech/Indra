namespace Indra.AstrA {

  namespace Tokens {

    namespace Keys {

      /// <summary>
      /// A token that represents the key used to access the local scope itself/ #mys.
      /// </summary>
      public class Self : Token.Type {

        /// <summary>
        /// The character that represents this token's pattern.
        /// </summary>
        public const char PATTERN = '.';

        /// <inheritdoc />
        public override string? name
          => "self_key";

        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => PATTERN;
      }
    }
  }
}
