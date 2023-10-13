




namespace Indra.AstrA {

  /// <summary>
  ///  The <see cref="Parser.Grammar" /> for the AstrA language.
  /// </summary>
  public class Grammar()
    : Grammar<Tokens.Source>("AstrA") {
    /// <inheritdoc />
    public override IEnumerable<(Token.Path matcher, Token.Style style)> styles => [
      ([Token.Type.Key<Tokens.Operator>()], Styles.Operators.Base)
    ];
  }

  namespace Tokens {
    namespace Values {
    }

    namespace Literals {

      public class Struct : Token.Type, Token.ISplayed {
        /// <inheritdoc />
        public static TokenTypesFetcher TYPES
          => _ => _
            ._<Structs.Array>()
            ._<Structs.Map>();
      }

      public class Primitive : Token.Type, Token.ISplayed {
        /// <inheritdoc />
        public static TokenTypesFetcher TYPES
          => _ => _
            ._<Primitives.Boolean>()
            ._<Primitives.Number>()
            ._<Primitives.String>()
            ._<Primitives.Empty>();
      }
    }

    namespace Primitives {

      public class Boolean : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.choice(
            _.read("true"),
            _.read("false")
          );
      }

      public class Number : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.notImplemented();
      }

      public class String : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.notImplemented();
      }

      public class Empty : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("empty");
      }
    }

    namespace Structs {

      public class Map : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.notImplemented();
      }

      public class Array : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.notImplemented();
      }
    }


    public class Entry : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _) => _
        .field("key", _.choice(
          _.token<Destructor>(),
           _.token<Identifier>()))
        .optional.spacing
        .field("operator", _.token<Assigner>())
        .spacing
        .field("value", _.token<Value>());
    }

    namespace Entries {
    }

    public class Destructor : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _)
        => _.notImplemented();
    }

    public class Identifier : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _)
        => _.choice(
          _.token<Key>(),
          _.token<Lookup>()
        );
    }

    public class Key : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _)
        => _.choice(
          _.token<Keys.Self>(),
          _.token<Keys.Archetype>(),
          _.token<Keys.Name>(),
          _.token<Keys.Index>(),
          _.token<Keys.Range>(),
          _.token<Keys.WildDot>(),
          _.token<Keys.WildSlash>(),
          _.token<Keys.Pattern>()
        // TODO: add rest
        );
    }

    namespace Keys {

      public class Name : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("name");
      }

      public class Index : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("index");
      }

      public class Range : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("range");
      }

      public class WildDot : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read(".*");
      }

      public class WildSlash : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.read("/*");
      }

      public class Pattern : Token.Type {
        /// <inheritdoc />
        protected override Rule build(Token.Builder _)
          => _.notImplemented();
      }
    }

    public class Lookup : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _)
        => _.notImplemented();
    }

    public class String : Token.Type {
      /// <inheritdoc />
      protected override Rule build(Token.Builder _)
        => _.notImplemented();
    }
  }
}