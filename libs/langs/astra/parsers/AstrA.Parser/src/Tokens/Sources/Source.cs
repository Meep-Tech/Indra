


namespace Indra.AstrA
{

  namespace Tokens
  {
    /// <summary>
    /// A part of the source code of an AstrA program.
    /// </summary>
    public class Source : Token.Type, Rule.ISplayed
    {
      /// <inheritdoc />
      public static TokenTypesFetcher TYPES
        => _ => _
          ._<Sources.Command>()
          ._<Sources.File>();
    }
  }
}
