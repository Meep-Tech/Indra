namespace Indra.AstrA.Tokens {

  namespace Assigners {

    /// <summary>
    ///   The procedural assignment operator.
    /// </summary>
    public class ProceduralAssigner : Assigner, Token.IConstant {

      /// <summary>
      ///  The pattern for the procedural assignment operator.
      /// </summary>
      public static string PATTERN
        => ">>";
    }
  }
}