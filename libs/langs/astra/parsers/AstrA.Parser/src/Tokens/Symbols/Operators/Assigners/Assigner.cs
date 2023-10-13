
namespace Indra.AstrA.Tokens {
  /// <summary>
  /// An operator used to assign a value to a key.
  /// </summary>
  public class Assigner : Operator, Token.ISplayed {
    /// <inheritdoc />
    public static TokenTypesFetcher TYPES
      => _ => _
        ._<Assigners.ProceduralAssigner>()
        ._<Assigners.ConstantAssigner>()
        ._<Assigners.MutableAssigner>();

    /// <inheritdoc />
    public override Token.Style style
      => Styles.Assigners.Base;
  }
}