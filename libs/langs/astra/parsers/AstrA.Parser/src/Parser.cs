namespace AstrA
{

  public class Parser
  {

    static public Result Parse(IInput input)
    {
      if (input is FileInput fi)
      {
        return Parse(new StreamReader(fi.file), input.config);
      }
      else if (input is TextInput ti)
      {
        return Parse(ti.text, input.config);
      }
      else
      {
        return Result.Failure(new Error
        {
          message = "No input source provided"
        });
      }
    }

    static public Result Parse(string src, Config? config = null)
      => Parse(new StringReader(src), config);

    static public Result Parse(TextReader source, Config? config = null)
    {
      var parser = new Parser();
      return parser._parse(source, config);
    }

    public static State InitalizeState(TextReader source) => new State
    {
      previous = null,
      cursor = new Cursor
      {
        line = 1,
        column = 1,
        index = 0,
        character = source.Read();
        preview = source.Peek();
      },
      indentation = new Indentation
      {
        isBeingRead = true
      },
      next = null
    };

    Result _parse(TextReader source, Config? config = null)
    {
      var state = new State
      {
        cursor = new Cursor
        {
          line = 1,
          column = 1,
          index = 0,
        },
        current = (char)source.Read(),
        indentation = new Indentation
        {
          stack = [],
          current = []
        }
      };

      return Result.Failure(new Error
      {
        message = "Not implemented"
      });
    }

    void _read(TextReader source, ref Token.Data target, ref State state)
    {
      /// Check for unhandled end of file
      if (state.cursor.character == '\0' && state.cursor.previous != '\0')
      {
        throw new Exception("Unexpected end of file");
      }

      /// Update token
      target.content += state.cursor.character;

      /// Update cursor state
      // update line column and index
      var cursor = state.cursor;

      cursor.index++;
      if (state.cursor.character == '\r'
        && state.cursor.character == '\n'
        && state.cursor.next != '\r'
        && state.cursor.next != '\n'
      )
      {
        cursor.line++;
        cursor.column = 0;
      }
      else
      {
        cursor.column++;
      }

      /// Update indentation
      if (state.cursor.character == )


        /// Update previous, current and next
        cursor.previous = cursor.character;
      cursor.character = (char)source.Read();
      cursor.next = (char)source.Peek();

      // skip \r\n and \n\r
      if (cursor.character == '\n')
      {
        if (cursor.previous != '\r')
        {
          if (cursor.next == '\r')
          {
            _read(source, ref target, ref state);
          }
        }
      }
      else if (cursor.character == '\r')
      {
        if (cursor.previous != '\n')
        {
          if (cursor.next == '\n')
          {
            _read(source, ref target, ref state);
          }
        }
      }

      state.cursor = cursor;
    }

    public abstract class Token
    {
      public record struct Data(
        string name,
        string content,
        ICollection<Token> children,
        ICollection<Field> fields
      )
      {
        public string name { get; internal set};
        public string content { get; internal set};
      }

      public record struct Field(
        string name,
        object value
      );

      public abstract bool match(Builder builder, [NotNullWhen(true)] out Match? match);

      public class Builder(
        State start
      )
      {
        public State current { get; private set} = start;

        public void read()
        {
          throw new NotImplementedException();
        }

        public void skip()
        {
          throw new NotImplementedException();
        }

        public void end()
        {
          throw new NotImplementedException();
        }

        public void fail(Error error)
        {
          throw new NotImplementedException();
        }

      public bool tryChild<TChild>()
      {

      }

      public bool tryChildren<TChild>()
      {

      }
    
      }

    }

    [Serializeable]
    public record struct Cursor
    {
      public int line { get; internal set; }
      public int column { get; internal set; }
      public int index { get; internal set; }
      public char character { get; internal set; }
      public char preview { get; internal set; }

      public bool matches(CharToken @char)
      {
        return toToken().tryToMatch(@char);
      }

      public CharToken toToken()
      {
        return new CharToken(character);
      }

      public string ToString()
      {
        return JsonSerializer.Serialize(this);
      }
    }

    public record struct State
    {
      public State? next { get; internal set; }
      public State? previous { get; internal set; }
      public Cursor cursor { get; internal set; }
      public Indentation indentation { get; internal set; }
      public readonly bool isNewFile => cursor.index == 0;
      public readonly bool isNewLine => cursor.character == '\n' || cursor.character == '\r';
      public readonly bool isEndOfFile => cursor.character == '\0';
      public readonly bool isIndentation => indentation.isBeingRead;
      public readonly bool isEndOfLine => isNewLine || isEndOfFile;
    }

    public record struct Indentation
    {

      public bool isBeingRead { get; internal set; }
      public Indent[] stack { get; internal set; } = []
      public Indent current { get; internal set; } = []
      public readonly int level => stack.Length;
      public readonly char[] previous => stack[level - 1];
    }

    public record Indent
    {
      public char[] chars { get; internal init; }
      public int length => chars.Sum(c => c == '\t' ? _config.tabSize : 1);
      public bool isTab => chars.Length == 1 && chars[0] == '\t';
      Config _config;

      internal Indent(char[] chars, Config config)
      {
        this.chars = chars;
        _config = config;
      }

      public Indent append(char character)
      {
        if (character not in INDENT_CHARS) {
          throw new InvalidOperationException($"""
            Cannot append non-indent charachter: {charachter}, to indent: {this}.
            - Only Inline Spaces or Tabs are allowed.
          """);
        }

        return this with
        {
          chars = chars.append(character).toArray()
        };
      }
    }

    static char[] INDENT_CHARS = [' ', '\t'];

    public record Result
    {
      public bool success { get; private set; }
      public Error? error { get; private set; }
      public Tree? tree { get; private set; }
      private Result() { }

      public static Result Success(Tree tree)
      {
        return new Result()
        {
          success = true,
          tree = tree
        };
      }

      public static Result Failure(Error error)
      {
        return new Result()
        {
          success = false,
          error = error
        };
      }

      public static implicit operator boolean(Result result)
      {
        return result.success;
      }
    }

    public record Error
    {
      public required string message { get; init; }
      public State state { get; init; }
    }

    public interface IInput
    {
      Config config { get; }
    }

    public record FileInput(
      string file,
      Config? config = null
    ) : IInput
    {
      public Config config { get; init; }
      = config ?? new();

      public static explicit operator FileInput(string file)
        => new(file);
    }

    public record TextInput(
      string text,
      Config? config = null
    ) : IInput
    {
      public Config config { get; init; }
       = config ?? new();

      public static implicit operator TextInput(string text)
        => new(text);
    }

    public record ReaderInput(
      TextReader reader,
      Config? config = null
    ) : IInput
    {
      public Config config { get; init; }
       = config ?? new();

      public static implicit operator ReaderInput(TextReader reader)
        => new(reader);
    }

    public record Config(
      short tabSize = 1,


    );

    public class Tree
    {

    }
  }

  namespace Tokens
  {
    public class CharToken
    {

    }
  }
}
