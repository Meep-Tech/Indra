
namespace Indra.AstrA.Tokens {
  /// <summary>
  /// An operator used to assign a value to a key.
  /// </summary>
  [Token.Splayed]
  [Token.Choice<ProceduralAssigner>]
  [Token.Choice<ConstantAssigner>]
  [Token.Choice<MutableAssigner>]
  public class Assigner
    : Operator;
}