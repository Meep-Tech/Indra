namespace Indra.AstrA.Tokens;

/// <summary>
/// Wrapped type for all AstrA tokens.
/// </summary>
public partial record Token(Token.Type type)
  : Meep.Tech.Parser.Token(type) {

  /// <inheritdoc />
  public new Token.Type type
    => (Token.Type)base.type;

  /// <summary>
  /// Wrapped type for all AstrA Token Types.
  /// </summary>
  public new class Type
    : Meep.Tech.Parser.Token.Type;
}

#region Statements
#region Expressions
#region Literals
#region Structures
#region Closures

#endregion

#endregion

#region Primitives

/// <summary>
/// A literal representation of a number.
/// </summary>
public class Number
  : Primitive, Token.ISplayed {
  System.Type Token.ISplayed.type
  => typeof(Number);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<Decimal>()
      ._<Integer>();
}

/// <summary>
/// A delimited literal representation of a string.
/// </summary>
public class String
  : Primitive, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(String);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<SimpleString>()
      ._<TemplateString>()
      ._<CodeString>();
}

#region Numbers

public class Decimal
  : Number;

public class Integer
  : Number;

#endregion

#region Strings

public class SimpleString
  : String;

public class TemplateString
  : String;

public class CodeString
  : String;

#endregion

#endregion

#region Markups

public class Block
  : Markup;

public class Component
  : Block;

public class Element
  : Markup, Token.IChoice {
  System.Type Token.IChoice.type
    => typeof(Element);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<Table>()
      ._<List>()
      ._<Text>();
}

#region Elements

public class List
  : Element, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(List);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<OrderedList>()
      ._<UnorderedList>();
}

public class Text
  : Element, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(Text);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<Word>()
      ._<Words>();
};

public class Table
  : Element;

#region Text

public class Word
  : Text;

public class Words
  : Text, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(Words);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<Sentence>()
      ._<Paragrah>();
}

#region Words

public class Sentence
  : Words;

public class Paragrah
  : Words;


#endregion

#endregion

#region Lists

public class OrderedList
  : List;

public class UnorderedList
  : List;

#endregion

#endregion

#endregion

#endregion

#region Invocations

/// <summary>
/// A tag alias or other special decorator used to modify an entry.
/// </summary>
[Token.NotImplemented]
public class Attribute
  : Invocation;

/// <summary>
/// A tag used to modify an entry.
/// </summary>
[Token.NotImplemented]
public class Tag
  : Attribute;

/// <summary>
/// A lookup using an identifier chain.
/// </summary>
public class Lookup
  : Invocation, Token.IBag, IIdentifier {
  System.Type Token.IBag.type
    => typeof(Lookup);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<DotLookup>()
      ._<SlashLookup>()
      ._<IndexLookup>()
      ._<IQueryLookup>()
      ._<ScopeId>();
}

/// <summary>
/// A lookup using a dot to capture args.
/// </summary>
public class DotLookup
  : Lookup;

/// <summary>
/// A lookup using a slash to capture args.
/// </summary>
public class SlashLookup
  : Lookup;

/// <summary>
/// A lookup using arrow brackets to capture args
/// often used to generify a type or query objects.
/// </summary>
public class IndexLookup
  : Lookup;

/// <summary>
/// A lookup that uses `&lt;? ... &gt;` to query for specific items in a structure.
/// </summary>
public class IQueryLookup
  : Lookup;

/// <summary>
/// A call to an identifier with initial input arguments.
/// </summary>
public class Call
  : Invocation;

/// <summary>
/// An operation with a symbol and input arguments.
/// </summary>
public class Operation
  : Invocation, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(Operation);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<FlaggedOperation>()
      ._<ChainedOperation>()
      ._<SpacedOperation>();
}

#region Identifiers

/// <summary>
/// An identifier for an explicit specific scope.
/// </summary>
[Token.Splayed]
[Token.Choice<GlobalId>]
[Token.Choice<WebId>]
[Token.Choice<FolderId>]
[Token.Choice<OuterId>]
[Token.Choice<OwnId>]
public class ScopeId
  : Lookup;

[Token.NotImplemented]
public class GlobalId
  : Lookup;

[Token.NotImplemented]
public class WebId
  : Lookup;

[Token.NotImplemented]
public class FolderId
  : Lookup;

[Token.NotImplemented]
public class OuterId
  : Lookup;

[Token.NotImplemented]
public class OwnId
  : Lookup;

[Token.Splayed]
[Token.Choice<OwnTraitId>]
[Token.Choice<OwnTypeId>]
public class TypeId
  : Lookup;

[Token.NotImplemented]
public class OwnTypeId
  : TypeId;

[Token.NotImplemented]
public class OwnTraitId
  : TypeId;

/// <summary>
/// An operation with minimal to no spacing
/// </summary>
public class ChainedOperation
  : Operation, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(ChainedOperation);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<PrefixOperation>()
      ._<SuffixOperation>();
}

/// <summary>
/// An operation with required spacing.
/// </summary>
public class SpacedOperation
  : Operation, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(SpacedOperation);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<InfixOperation>()
      ._<PreceedingOperation>();
}

public class PrefixOperation
  : ChainedOperation;

public class SuffixOperation
  : ChainedOperation;

public class InfixOperation
  : SpacedOperation;

public class PreceedingOperation
  : SpacedOperation;

public class FlaggedOperation
  : SuffixOperation;

#endregion
#endregion
#endregion
#region Assignments

public class Mutation
  : Assignment;

public class Declaration
  : Assignment;

public class Deconstruction
  : Assignment;

#endregion

#endregion

#region Keys

/// <summary>
/// Represents a key used to index values of entries within structures.
/// </summary>
public class Key : Token.Type, Token.ISplayed, IIdentifier {
  System.Type Token.ISplayed.type
    => typeof(Key);

  /// <inheritdoc />
  public TokenTypesFetcher options
    => _ => _
      ._<Filter>()
      ._<Index>()
      ._<Range>()
      ._<Generic>()
      ._<Pattern>()
      ._<Name>();
}

public class Name
  : Key;

public class Index
  : Key;

public class Range
  : Key;

public class Generic
  : Key;

public class Pattern
  : Key;

/// <summary>
/// A key that uses asterisks to match key patterns of different kinds.
/// </summary>
public class Filter
  : Key {
  /// <inheritdoc />
  protected override Rule build(Parser.Token.Builder _) => _
    .choice(
      _.field<LookupOperator>("operator")
        .then.repeat.choice(
          _.token<Wildcard>(),
          _.token<Name>()),
      _.read<GenericLookupStartDelimiter>()
        .then.repeat.choice(
          _.token<Wildcard>(),
          _.token<Name>())
        .then.read<GenericLookupEndDelimiter>()
    );
}

/// <summary>
/// A key that uses a symbol to match any key and make filters for keymatching.
/// </summary>
public class Wildcard
  : Key, Token.IConstant {
  System.Type Token.IConstant.type
    => typeof(Wildcard);

  /// <inheritdoc />
  public string pattern
    => "*";
}

/// <summary>
/// A key that matches any key that uses the dot lookup operator.
/// </summary>
public class WildDot
  : Key;

/// <summary>
/// A key that matches any key that uses the slash lookup operator.
/// </summary>
public class WildSlash
  : Key;

/// <summary>
/// A key that matches any key that uses the generic lookup operator.
/// </summary>
public class WildGeneric
  : Key;

/// <summary>
/// A key that matches any key.
/// </summary>
public class WildAny
  : Key;

#endregion

#region Symbols

#region Operators

#region Lookup Operators

/// <summary>
/// An operator used to lookup an entry.
/// </summary>
public class LookupOperator
  : Token.Type, Token.ISplayed {
  System.Type Token.ISplayed.type
    => typeof(LookupOperator);

  /// <inheritdoc />
  public override TokenTypesFetcher options
    => _ => _
      ._<DotLookupOperator>()
      ._<SlashLookupOperator>()
      ._<GenericLookupOperator>();
}

#endregion

#endregion

#region Delimiters

#endregion

#endregion

#region Helper Types

/// <summary>
/// Indicates that the token is an identifier, indexer, or key
/// </summary>
public interface IIdentifier;

/// <summary>
/// Helper for an address/key/id surrounded by attributes.
/// </summary>
public class Signature<
  TAddress,
  TAttributes
> : Token.Type
  where TAddress : Token.Type, IIdentifier, new()
  where TAttributes : Attribute, new() {
  /// <inheritdoc />
  protected override Rule build(Parser.Token.Builder _) => _
    .optional.field("attributes", _.token<AboveAttributes<TAttributes>>())
    .optional.field("attributes", _.token<PreceedingAttributes<TAttributes>>())
    .field("key", _.token<TAddress>())
    .optional.field("attributes", _.token<TailingAttributes<TAttributes>>());
}

/// <summary>
/// 
/// </summary>
/// <typeparam name="TAddress"></typeparam>
public class Signature<TAddress>
  : Signature<TAddress, Attribute>
  where TAddress : Token.Type, IIdentifier, new();

#endregion