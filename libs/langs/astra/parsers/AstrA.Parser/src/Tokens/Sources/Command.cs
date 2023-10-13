


namespace Indra.AstrA {

  namespace Tokens {

    namespace Sources {
      /// <summary>
      /// An immediately executed AstrA command.
      /// </summary>
      public class Command : Source {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _
          .field<Assigners.ProceduralAssigner>("indicator")
          .ws
          .token<Statement>();
      }
    }
  }
}
