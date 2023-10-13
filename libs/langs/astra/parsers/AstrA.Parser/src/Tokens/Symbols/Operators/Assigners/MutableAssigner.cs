namespace Indra.AstrA.Tokens {

  namespace Assigners {
    /// <summary>
    ///  The mutable assignment operator.
    /// </summary>
    public class MutableAssigner : Assigner, Token.IConstant {

      /// <summary>
      ///  The pattern for the mutable assignment operator.
      /// </summary>
      public static string PATTERN
        => ":";
    }
  }
}
