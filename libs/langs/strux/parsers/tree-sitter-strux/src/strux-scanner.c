// Macros and base code taken from tree-sitter-python
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <tree_sitter/parser.h>

enum TokenType
{
  NAME
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

/// @brief The scanner struct, with the indent vector data
typedef struct
{
  name_vec name;
} Scanner;

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

bool tree_sitter_strux_external_scanner_scan(
    void *payload,
    TSLexer *lexer,
    const bool *valid_symbols)
{
  Scanner *scanner = (Scanner *)payload;

  return scan_for_name(scanner, lexer, valid_symbols);
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

  return size;
}

void tree_sitter_strux_external_scanner_deserialize(
    void *payload,
    const char *buffer,
    unsigned length)
{
  Scanner *scanner = (Scanner *)payload;

  if (length > 0)
  {
    size_t size = 0;

    size_t name_len = (uint8_t)buffer[size++];
    if (name_len > 0)
    {
      scanner->name.len = name_len;
      size += name_len;
    }
  }
}

void *tree_sitter_strux_external_scanner_create()
{
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->name = new_name_vec();
  tree_sitter_strux_external_scanner_deserialize(scanner, NULL, 0);
  return scanner;
}

void tree_sitter_strux_external_scanner_destroy(void *payload)
{
  Scanner *scanner = (Scanner *)payload;
  free(scanner);
}