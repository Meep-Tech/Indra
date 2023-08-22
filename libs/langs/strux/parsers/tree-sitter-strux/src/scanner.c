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
  NEWLINE
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

/// @brief Skip to the end of the whitespace
/// @param lexer The lexer
/// @param found_end_of_line True if the end of the line was found
/// @param indent_length The length of the indentation
void lex_to_end_of_whitespace(
    TSLexer *lexer,
    bool *found_end_of_line,
    uint32_t *indent_length)
{
  *found_end_of_line = false;
  *indent_length = 0;

  for (;;)
  {
    if (lexer->lookahead == '\n')
    {
      *found_end_of_line = true;
      *indent_length = 0;
      skip(lexer);
    }
    else if (lexer->lookahead == ' ')
    {
      *indent_length++;
      skip(lexer);
    }
    else if (lexer->lookahead == '\r' || lexer->lookahead == '\f')
    {
      *indent_length = 0;
      skip(lexer);
    }
    else if (lexer->lookahead == '\t')
    {
      *indent_length += 8;
      skip(lexer);
    }
    else if (lexer->eof(lexer))
    {
      *indent_length = 0;
      *found_end_of_line = true;
      break;
    }
    else
    {
      break;
    }
  }
}

/// @brief Try to match the indentation tokens
bool try_to_match_indentation_tokens(
    Scanner *scanner,
    TSLexer *lexer,
    const bool *valid_symbols,
    bool found_end_of_line,
    uint32_t indent_length)
{

  const looking_for_indentation =
      valid_symbols[NEWLINE] ||
      valid_symbols[INDENT] ||
      valid_symbols[DEDENT] ||
      valid_symbols[SAMEDENT];

  if (found_end_of_line && looking_for_indentation)
  {
    if (scanner->indents.len > 0)
    {
      uint16_t current_indent_length =
          VEC_BACK(scanner->indents);

      if (valid_symbols[INDENT] &&
          indent_length > current_indent_length)
      {
        VEC_PUSH(scanner->indents, indent_length);
        lexer->result_symbol = INDENT;
        return true;
      }

      if (valid_symbols[DEDENT] &&
          indent_length < current_indent_length)
      {
        VEC_POP(scanner->indents);
        lexer->result_symbol = DEDENT;
        return true;
      }

      if (valid_symbols[SAMEDENT] &&
          indent_length == current_indent_length)
      {
        lexer->result_symbol = SAMEDENT;
        return true;
      }

      if (valid_symbols[NEWLINE])
      {
        lexer->result_symbol = NEWLINE;
        return true;
      }
    }
  }

  return false;
}

/// @brief Use lookahead to count the indentation level
/// @return True if the token was matched as an indent, dedent or samedent. This will also mean that the lexer->result_symbol will be set to the correct token type.
bool scan_for_indentations(
    Scanner *scanner,
    TSLexer *lexer,
    const bool *valid_symbols)
{
  bool *found_end_of_line;
  uint32_t *indent_length;

  lex_to_end_of_whitespace(
      lexer,
      &found_end_of_line,
      &indent_length);

  return try_to_match_indentation_tokens(
      scanner,
      lexer,
      valid_symbols,
      found_end_of_line,
      indent_length);
}

bool tree_sitter_strux_external_scanner_scan(
    void *payload,
    TSLexer *lexer,
    const bool *valid_symbols)
{
  Scanner *scanner = (Scanner *)payload;

  if (scan_for_name(scanner, lexer, valid_symbols))
  {
    return true;
  }

  return scan_for_indentations(scanner, lexer, valid_symbols);
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