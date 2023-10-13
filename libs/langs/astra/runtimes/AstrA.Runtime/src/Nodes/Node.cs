using System.Collections.Specialized;
namespace Indra.AstrA.Runtime;

public interface INode;

public class Node
  : INode;

public class Logic
  : Node;

public interface IData
  : INode;

public class Data
  : Node, IData;

public interface IKey
  : IData;

public class Statement
  : Logic;

public class Entry
  : Data;

public class Value
  : Data;

public class Instance
  : Value;

public class Structure : Instance {

  private Dictionary<IKey, Entry>? _compiledEntries;
  private readonly OrderedDictionary _entries
    = [];

  public IReadOnlyDictionary<IKey, Entry> entries
    => _compiledEntries ??= _entries.Cast<KeyValuePair<IKey, Entry>>().ToDictionary(
      x => x.Key,
      x => x.Value
    );

  private Dictionary<IKey, Trait>? _compiledTraits;
  private readonly OrderedDictionary _traits
    = [];

  public IReadOnlyDictionary<IKey, Trait> traits
    => _compiledTraits ??= _traits.Cast<KeyValuePair<IKey, Trait>>().ToDictionary(
      x => x.Key,
      x => x.Value
    );
}

public class Refrence : Value {

}

public class Trait : Refrence {

}

public class Root : Structure {

}

