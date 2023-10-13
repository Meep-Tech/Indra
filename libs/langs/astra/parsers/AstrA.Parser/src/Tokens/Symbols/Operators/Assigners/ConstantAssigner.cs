namespace Indra.AstrA.Tokens {

  namespace Assigners {
    /// <summary>
    ///  The constant assignment operator.
    /// </summary>
    public class ConstantAssigner : Assigner, Token.IConstant {

      /// <summary>
      ///  The pattern for the constant assignment operator.
      /// </summary>
      public static string PATTERN
        => "::";
    }
  }
}
