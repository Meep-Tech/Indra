namespace Indra.AstrA.Tokens;

/// <summary>
/// A file with a single trait defined.
/// </summary>
[Token.Filetype("trt.axa")]
[Token.Filetype("trait")]
public class TraitFile
  : File {
  /// <inheritdoc />
  protected override Rule build(Parser.Token.Builder _) => _
    .field("key", _.token<Signature<OwnTypeId>>(name: "key"))
    .token<Procedural>();
}
