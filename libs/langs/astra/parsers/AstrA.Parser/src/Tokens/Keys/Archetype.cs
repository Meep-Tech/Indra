namespace Indra.AstrA {

  namespace Tokens {

    namespace Keys {

      /// <summary>
      /// A token that represents the key used to access the local scope's archetype./ #mya
      /// </summary>
      public class Archetype : Token.Type {

        /// <summary>
        /// The string that represents this token's pattern.
        /// </summary>
        public const string PATTERN = ".#";

        /// <inheritdoc />
        override public string? name
          => "arc_key";

        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("archetype");
      }
    }
  }
}
