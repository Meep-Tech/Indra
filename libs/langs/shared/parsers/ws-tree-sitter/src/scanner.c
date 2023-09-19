// Macros and base code taken from tree-sitter-python
#include "../tree_sitter/parser.h"
#include "scan_for_whitespace.c"
#include "utils/vec.c"
#include <stdbool.h>
#include <stdint.h>
#include <string.h>

// Token types the internal scanner can return
enum TokenType {
  // Signifies an error state
  ERROR = (INLINE_SPACING + 1)
};

#pragma region Tree Sitter API

bool tree_sitter_strux_external_scanner_scan(void *payload, TSLexer *lexer,
                                             const bool *valid_symbols) {
  LOG("\n===EXTERNAL SCANNER===", ">");
  Scanner *scanner = (Scanner *)payload;

  LOG("> > SCANNER::START", "cha: %c, col: %d, indt: %d, lvl: %d",
      lexer->lookahead, lexer->get_column(lexer), VEC_BACK(scanner->indents),
      scanner->indents.len - 1);

  if (valid_symbols[ERROR]) {
    LOG("< < ERROR::FAILED",
        "Exiting external scanner: Was to attempting to scan for _error_\n");

    return false;
  }

  if (scan_for_whitespace(scanner, lexer, valid_symbols)) {
    LOG("< < WHITESPACE::FOUND", "Exiting external scanner.\n");
    return true;
  } else {
    LOG("< < WHITESPACE::FAILED", "Exiting external scanner.\n");
    return false;
  }
}

unsigned tree_sitter_strux_external_scanner_serialize(void *payload,
                                                      char *buffer) {
  Scanner *scanner = (Scanner *)payload;

  size_t size = 0;

  int iter = 1;
  for (; iter < scanner->indents.len &&
         size < TREE_SITTER_SERIALIZATION_BUFFER_SIZE;
       ++iter) {
    buffer[size++] = (char)scanner->indents.data[iter];
  }

  return size;
}

void tree_sitter_strux_external_scanner_deserialize(void *payload,
                                                    const char *buffer,
                                                    unsigned length) {
  Scanner *scanner = (Scanner *)payload;

  VEC_CLEAR(scanner->indents);
  VEC_PUSH(scanner->indents, 0);

  if (length > 0) {
    size_t size = 0;

    for (; size < length; size++) {
      VEC_PUSH(scanner->indents, (unsigned char)buffer[size]);
    }
  }
}

void *tree_sitter_strux_external_scanner_create() {
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->indents = new_indent_vec();
  tree_sitter_strux_external_scanner_deserialize(scanner, NULL, 0);
  return scanner;
}

void tree_sitter_strux_external_scanner_destroy(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  VEC_FREE(scanner->indents);
  free(scanner);
}

#pragma endregion
