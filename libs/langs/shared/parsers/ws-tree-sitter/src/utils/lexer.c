#include "../../tree_sitter/parser.h"
#include "debug.c"

/// @brief Advance the lexer to the next character
static inline void read(TSLexer *lexer) {
  LOG(" - LEXER::READ", "%c", lexer->lookahead);
  lexer->advance(lexer, false);
}

/// @brief Skip the lexer to the next character
static inline void skip(TSLexer *lexer) {
  LOG(" - LEXER::SKIP", "%c", lexer->lookahead);
  lexer->advance(lexer, true);
}

/// @breif Move the lexer's end to the current value
static inline void end(TSLexer *lexer) {
  LOG(" - LEXER::MARK", "at col: %d", lexer->get_column(lexer));
  lexer->mark_end(lexer);
}
