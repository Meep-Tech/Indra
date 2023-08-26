// Macros and base code taken from tree-sitter-python
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <tree_sitter/parser.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))

#define VEC_RESIZE(vec, _cap)                                      \
  void *tmp = realloc((vec).data, (_cap) * sizeof((vec).data[0])); \
  assert(tmp != NULL);                                             \
  (vec).data = tmp;                                                \
  (vec).cap = (_cap);

#define VEC_PUSH(vec, el)                      \
  if ((vec).cap == (vec).len)                  \
  {                                            \
    VEC_RESIZE((vec), MAX(16, (vec).len * 2)); \
  }                                            \
  (vec).data[(vec).len++] = (el);

#define VEC_POP(vec) (vec).len--;

#define VEC_NEW                      \
  {                                  \
    .len = 0, .cap = 0, .data = NULL \
  }

#define VEC_BACK(vec) ((vec).data[(vec).len - 1])

#define VEC_FREE(vec)       \
  {                         \
    if ((vec).data != NULL) \
      free((vec).data);     \
  }

#define VEC_CLEAR(vec) (vec).len = 0;

enum TokenType
{
  NAME,

  INDENT,
  DEDENT,
  SAMEDENT,

  NEWLINE,     // \n
  END_OF_LINE, // [ \t]*\n
  END_OF_FILE, // eof?

  ERROR
};

typedef struct
{
  uint32_t len;
} name_vec;

static name_vec new_name_vec()
{
  name_vec vec;
  return vec;
}

/// @brief The indent data that is stored in the scanner's state
typedef struct
{
  uint32_t len;
  uint32_t cap;
  uint16_t *data;
} indent_vec;

/// @brief The scanner struct, with the indent vector data
typedef struct
{
  indent_vec indents;
  name_vec name;
} Scanner;

/// @brief Used to construct a new indent vector
static indent_vec new_indent_vec()
{
  indent_vec vec = VEC_NEW;
  vec.data = calloc(1, sizeof(uint16_t));
  vec.cap = 1;
  return vec;
}

/// @brief Advance the lexer to the next character
static inline void advance(TSLexer *lexer)
{
  lexer->advance(lexer, false);
}

/// @brief Skip the lexer to the next character
static inline void skip(TSLexer *lexer)
{
  lexer->advance(lexer, true);
}

/// @brief Scan the name token
/// @return True if the token was matched as a name
bool scan_for_name(
    Scanner *scanner,
    TSLexer *lexer,
    const bool *valid_symbols)
{
  if (valid_symbols[NAME])
  {
    // read for a name until there's a `:` followed immediately by a whitespace/newline
    while (lexer->lookahead)
    {
      if (lexer->lookahead == ':')
      {
        advance(lexer);
        if (lexer->lookahead == ' ' || lexer->lookahead == '\t' || lexer->lookahead == '\n')
        {
          lexer->result_symbol = NAME;
          return true;
        }
      }
      else
      {
        advance(lexer);
        lexer->mark_end(lexer);
      }
    }
  }

  return false;
}

bool scan_for_whitespace(
    Scanner *scanner,
    TSLexer *lexer,
    const bool *valid_symbols)
{

  const looking_for_indentation =
      valid_symbols[INDENT] ||
      valid_symbols[DEDENT] ||
      valid_symbols[SAMEDENT];

  const looking_for_whitespace =
      looking_for_indentation ||
      valid_symbols[END_OF_LINE] ||
      valid_symbols[NEWLINE] ||
      valid_symbols[END_OF_FILE];

  if (looking_for_whitespace)
  {
    int current_indent = 0;
    bool found_whitespace = false;
    int result_symbol = ERROR;

    while (lexer->lookahead)
    {
      if (lexer->lookahead == '\n')
      {
        // EOL is most specific
        if (valid_symbols[NEWLINE] &&
            !found_whitespace)
        {
          advance(lexer);
          result_symbol = NEWLINE;

          break;
        } // newline isnt as specific as EOL
        else if (valid_symbols[END_OF_LINE])
        {
          advance(lexer);
          result_symbol = END_OF_LINE;

          break;
        } // newlines reset the indent
        else if (looking_for_indentation)
        {
          found_whitespace = true;
          current_indent = 0;
          advance(lexer);

          continue;
        } // not looking for anything that matches or allows for a newline
        else
        {
          return false;
        }
      } // caridge return is ignored
      else if (lexer->lookahead == '\r' || lexer->lookahead == '\f')
      {
        found_whitespace = true;
        advance(lexer);

        continue;
      } // spaces and tabs are used for indentation
      else if (lexer->lookahead == ' ' || lexer->lookahead == '\t')
      {
        // if were not looking for indentation, and we dont allow for EOL, then we dont allow for whitespace
        if (!looking_for_indentation &&
            !valid_symbols[END_OF_LINE])
        {
          return false;
        }

        // increase the indent
        current_indent += lexer->lookahead == ' ' ? 1 : 2;
        found_whitespace = true;

        advance(lexer);

        continue;
      } // end of file breaks out of the loop
      else if (lexer->eof(lexer))
      {
        // eof is most specific
        if (valid_symbols[END_OF_FILE] &&
            !found_whitespace)
        {
          advance(lexer);
          result_symbol = END_OF_FILE;
        } // end of file isnt as specific as EOL
        else if (valid_symbols[END_OF_LINE])
        {
          advance(lexer);
          result_symbol = END_OF_LINE;
        } // newline is even less specific
        else if (valid_symbols[NEWLINE] &&
                 !found_whitespace)
        {
          advance(lexer);
          result_symbol = NEWLINE;
        } // indentation is least specific when it comes to eof
        else if (looking_for_indentation)
        {
          current_indent = 0;
          advance(lexer);
        }

        break;
      } // anything else breaks out of the loop
      else
      {
        break;
      }
    }

    if (result_symbol == ERROR && looking_for_indentation)
    {
      int current_samedent = VEC_BACK(scanner->indents);

      if (valid_symbols[INDENT] &&
          current_indent > current_samedent)
      {
        VEC_PUSH(scanner->indents, current_indent);
        result_symbol = INDENT;
      }

      if (valid_symbols[DEDENT] &&
          current_indent < current_samedent)
      {
        VEC_POP(scanner->indents);
        result_symbol = DEDENT;
      }

      if (valid_symbols[SAMEDENT] &&
          current_indent == current_samedent)
      {
        result_symbol = SAMEDENT;
      }
    }

    if (result_symbol != ERROR)
    {
      lexer->result_symbol = result_symbol;
      lexer->mark_end(lexer);

      return true;
    }
  }

  return false;
}

bool tree_sitter_strux_external_scanner_scan(
    void *payload,
    TSLexer *lexer,
    const bool *valid_symbols)
{
  Scanner *scanner = (Scanner *)payload;

  if (scan_for_name(
          scanner,
          lexer,
          valid_symbols))
  {
    return true;
  }

  return scan_for_whitespace(
      scanner,
      lexer,
      valid_symbols);
}

unsigned tree_sitter_strux_external_scanner_serialize(
    void *payload,
    char *buffer)
{
  Scanner *scanner = (Scanner *)payload;

  size_t size = 0;

  size_t name_len = scanner->name.len;
  if (name_len > UINT8_MAX)
  {
    name_len = UINT8_MAX;
  }
  buffer[size++] = (char)name_len;

  int iter = 1;
  for (; iter < scanner->indents.len &&
         size < TREE_SITTER_SERIALIZATION_BUFFER_SIZE;
       ++iter)
  {
    buffer[size++] = (char)scanner->indents.data[iter];
  }

  return size;
}

void tree_sitter_strux_external_scanner_deserialize(
    void *payload,
    const char *buffer,
    unsigned length)
{
  Scanner *scanner = (Scanner *)payload;

  VEC_CLEAR(scanner->indents);
  VEC_PUSH(scanner->indents, 0);

  if (length > 0)
  {
    size_t size = 0;

    size_t name_len = (uint8_t)buffer[size++];
    if (name_len > 0)
    {
      scanner->name.len = name_len;
      size += name_len;
    }

    for (; size < length; size++)
    {
      VEC_PUSH(scanner->indents, (unsigned char)buffer[size]);
    }
  }
}

void *tree_sitter_strux_external_scanner_create()
{
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->indents = new_indent_vec();
  scanner->name = new_name_vec();
  tree_sitter_strux_external_scanner_deserialize(scanner, NULL, 0);
  return scanner;
}

void tree_sitter_strux_external_scanner_destroy(void *payload)
{
  Scanner *scanner = (Scanner *)payload;
  VEC_FREE(scanner->indents);
  free(scanner);
}