// Macros and base code taken from tree-sitter-python
#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <tree_sitter/parser.h>

#pragma region Debugging

// Toggle for Debugging:
#define DEBUG true

// Logging Macro (Debug mode only)
#if DEBUG
#define LOG(K, M, ...) fprintf(stderr, K " - " M "\n", ##__VA_ARGS__)
#else
#define LOG(...)                                                               \
  do {                                                                         \
  } while (0)
#endif

#pragma endregion

#pragma region Vector Helper Macros

#define MAX(a, b) ((a) > (b) ? (a) : (b))

#define VEC_RESIZE(vec, _cap)                                                  \
  void *tmp = realloc((vec).data, (_cap) * sizeof((vec).data[0]));             \
  assert(tmp != NULL);                                                         \
  (vec).data = tmp;                                                            \
  (vec).cap = (_cap);

#define VEC_PUSH(vec, el)                                                      \
  if ((vec).cap == (vec).len) {                                                \
    VEC_RESIZE((vec), MAX(16, (vec).len * 2));                                 \
  }                                                                            \
  (vec).data[(vec).len++] = (el);

#define VEC_POP(vec) (vec).len--;

#define VEC_NEW                                                                \
  { .len = 0, .cap = 0, .data = NULL }

#define VEC_BACK(vec) ((vec).data[(vec).len - 1])

#define VEC_FREE(vec)                                                          \
  {                                                                            \
    if ((vec).data != NULL)                                                    \
      free((vec).data);                                                        \
  }

#define VEC_CLEAR(vec) (vec).len = 0;

#pragma endregion

#pragma region Lexer Helpers

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
static inline void mark(TSLexer *lexer) {
  LOG(" - LEXER::MARK", "at col: %d", lexer->get_column(lexer));
  lexer->mark_end(lexer);
}

#pragma endregion

// Result types for chunks of the scanner
enum Result {
  // The token was found, successfully
  FOUND = 1,
  // The token was not found, but the scanner should continue
  SKIPPED = 0,
  // The token was not found, and the scanner should abort
  FAILED = -1
};

// Token types the internal scanner can return
enum TokenType {
  NAME,

  INDENT,
  DEDENT,
  SAMEDENT,

  NEWLINE,     // \n
  LINE_ENDING, // [ \t]*\n
  END_OF_FILE, // eof

  MULTILINE_SPACING, // [ \t\n]*
  INLINE_SPACING,    // [ \t]+

  // Signifies an error state
  ERROR
};

#pragma region Scanner Data Structures

/// @brief The indent data that is stored in the scanner's state
typedef struct {
  uint32_t len;
  uint32_t cap;
  uint16_t *data;
} indent_vec;

/// @brief Used to construct a new indent vector
static indent_vec new_indent_vec() {
  indent_vec vec = VEC_NEW;
  vec.data = calloc(1, sizeof(uint16_t));
  vec.cap = 1;
  return vec;
}

/// @brief The scanner struct, with the indent vector data
typedef struct {
  indent_vec indents;
} Scanner;

#pragma endregion

#pragma region Scanners

/// @brief Scan the name token
/// @return True if the token was matched as a name
uint8_t scan_for_name(Scanner *scanner, TSLexer *lexer,
                      const bool *valid_symbols) {
  bool name_has_started = false;

  if (valid_symbols[NAME]) {
    LOG("NAME::START", "Scanning for _name_.");

    // Read for a name until there's a `:` followed immediately by a
    // whitespace/newline
    while (lexer->lookahead) {
      if (lexer->eof(lexer)) {
        LOG("NAME::PEEK", "Found EOF before a Colon while looking for the end "
                          "of a _name_.");

        if (name_has_started) {
          LOG("NAME::FAILED", "Unexpected END-OF-FILE.");
          return FAILED;
        } else {
          LOG("NAME::SKIPPED", "Unexpected END-OF-FILE.");
          return SKIPPED;
        };
      } else if (lexer->lookahead == ':') {
        LOG("NAME::PEEK", "Found Colon(:); Checking for end of _name_.");
        read(lexer);

        if (lexer->lookahead == '\n') {
          LOG("NAME::PEEK", "Found Expected Newline(\\n).");
          read(lexer);

          if (lexer->lookahead == '\r') {
            LOG("NAME::PEEK", "Found Optional trailing Caridge Return (\\r).");
            read(lexer);
          }

          LOG("NAME::FOUND", "Successfully found a Newline after a Colon while "
                             "looking the end of a"
                             "_name_");
          lexer->result_symbol = NAME;

          return FOUND;
        } else if (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
          LOG("NAME::PEEK", "Found Excpected Whitespace(%c).",
              lexer->lookahead);
          LOG("NAME::FOUND",
              "Successfully found Whitespace(%c) after a Colon while looking "
              "the end of a"
              "_name_",
              lexer->lookahead);
          read(lexer);
          lexer->result_symbol = NAME;

          return FOUND;
        } else if (lexer->lookahead == '\r' || lexer->lookahead == '\f') {
          LOG("NAME::PEEK", "Found Expected Caridge Return (\\r).");
          read(lexer);

          if (lexer->lookahead == '\n') {
            LOG("NAME::PEEK", "Found Excpected trailing Newline (\\n).");
            read(lexer);

            LOG("NAME::FOUND", "Successfully found a Newline after a Colon "
                               "while looking the end of a _name_");
            lexer->result_symbol = NAME;

            return FOUND;
          } else {
            LOG("NAME::FAILED", "Excpected Newline after Colon and Caridge "
                                "Return at end of a _name_");

            return FAILED;
          }
        } else {
          LOG("NAME::PEEK",
              "Found Value Character(%c) after Colon(:). Assuming Colon is NOT "
              "the end of a _name_.",
              lexer->lookahead);

          name_has_started = true;
          read(lexer);
          mark(lexer);

          continue;
        }
      } else if (lexer->lookahead == '\n') {
        if (name_has_started) {
          LOG("NAME:FAILED",
              "Unexpected Newline in name. Newlines are only allowed "
              "after a Colon to end a _name_.");
          return FAILED;
        } else {
          LOG("NAME:SKIPPED", "Unexpected Newline before a _name_");
          return SKIPPED;
        }
      } else if (lexer->lookahead == '\r' || lexer->lookahead == '\f') {
        if (name_has_started) {
          LOG("NAME:FAILED",
              "Unexpected Carrige Return in name. Newlines are only allowed "
              "after a Colon to end a _name_.");
          return FAILED;
        } else {
          LOG("NAME:SKIPPED", "Unexpected Carrige Return before a _name_");
          return SKIPPED;
        }
      } else if (lexer->lookahead == '\t' || lexer->lookahead == ' ') {
        LOG("NAME::PEEK", "Found spacing(%c) while looking for a _name_.",
            lexer->lookahead);

        if (!name_has_started) {
          LOG("NAME::SKIPPED",
              "Found Unexpected Spacing(%c) before _name_ has started. _name_s "
              "are Expexted to be immediate.",
              lexer->lookahead);
          return SKIPPED;
        } else {
          read(lexer);
          mark(lexer);

          continue;
        }
      } else {
        LOG("NAME::PEEK",
            "Found Expected Value Character(%c) as part of a "
            "_name_.",
            lexer->lookahead);

        name_has_started = true;
        read(lexer);
        mark(lexer);

        continue;
      }
    }
  }

  return SKIPPED;
}

bool scan_for_whitespace(Scanner *scanner, TSLexer *lexer,
                         const bool *valid_symbols) {

  bool looking_for_indentation =
      valid_symbols[INDENT] || valid_symbols[DEDENT] || valid_symbols[SAMEDENT];

  bool looking_for_spacing =
      valid_symbols[INLINE_SPACING] || valid_symbols[MULTILINE_SPACING];

  bool looking_for_whitespace =
      looking_for_indentation || looking_for_spacing ||
      valid_symbols[LINE_ENDING] || valid_symbols[NEWLINE] ||
      valid_symbols[END_OF_FILE];

  if (looking_for_whitespace) {
    LOG("WHITESPACE::START", "Scanning for _whitespace_.");

    int current_indent = 0;
    bool found_whitespace = false;
    bool found_carridge_return_part = false;
    int result_symbol = ERROR;

    while (lexer->lookahead) {
      // end of file breaks out of the loop
      if (lexer->eof(lexer)) {
        LOG("WHITESPACE::PEEK", "Found EOF.");

        // eof is most specific
        if (valid_symbols[END_OF_FILE] && !found_whitespace) {
          LOG("WHITESPACE::FOUND",
              "Successfully found _end of file_ while looking "
              "for _whitespace_");

          result_symbol = END_OF_FILE;

        } // end of file isnt as specific as EOL
        else if (valid_symbols[LINE_ENDING]) {
          LOG("WHITESPACE::FOUND",
              "Successfully found _line_ending_ while looking "
              "for _whitespace_");

          result_symbol = LINE_ENDING;
        } // newline is even less specific
        else if (valid_symbols[NEWLINE] && !found_whitespace) {
          LOG("WHITESPACE::FOUND", "Successfully found _newline_ while looking "
                                   "for _whitespace_");

          result_symbol = NEWLINE;
        } // indentation is least specific when it comes to eof
        else if (looking_for_indentation) {
          // TODO: try having this return false if we cant get indents to work
          // with eof.
          LOG("WHITESPACE::INDENT",
              "Found EOF while looking for _indentation_, "
              "resetting indents to 0.\n\t - Indents reset from %d to 0",
              current_indent);

          current_indent = 0;
        }

        break;
      } // newline char is handled in a special way
      else if (lexer->lookahead == '\n') {
        LOG("WHITESPACE::PEEK", "Found Newline(\\n).");

        // newline char is most specific
        if (valid_symbols[NEWLINE] && !found_whitespace) {
          read(lexer);
          mark(lexer);
          result_symbol = NEWLINE;

          // check for a tailing carridge return
          if (lexer->lookahead == '\r') {
            LOG("WHITESPACE::PEEK", "Found Optional trailing Caridge Return "
                                    "(\\r).");

            read(lexer);
            mark(lexer);
          }

          LOG("WHITESPACE::FOUND",
              "Successfully found a _newline_ while looking "
              "for _whitespace_");

          break;
        } // newline isnt as specific as EOL
        else if (valid_symbols[LINE_ENDING]) {
          read(lexer);
          mark(lexer);
          result_symbol = LINE_ENDING;

          // check for a tailing carridge return
          if (lexer->lookahead == '\r' && !found_carridge_return_part) {
            LOG("WHITESPACE::PEEK", "Found Optional trailing Caridge Return "
                                    "(\\r).");
            read(lexer);
            mark(lexer);
          }

          LOG("WHITESPACE::FOUND",
              "Successfully found a _line ending_ while looking "
              "for _whitespace_");
          break;
        } // newlines reset the indent
        else if (looking_for_indentation) {
          LOG("WHITESPACE::INDENT", "Found Newline(\\n) while looking for "
                                    "_indentation_, resetting indents to 0");
          found_whitespace = true;
          current_indent = 0;
          read(lexer);
          mark(lexer);

          continue;
        } // newlines are allowed if looking for any whitespace
        else if (valid_symbols[MULTILINE_SPACING]) {
          found_whitespace = true;
          read(lexer);
          mark(lexer);

          continue;
        } // not looking for anything that matches or allows for a newline
        else {
          LOG("WHITESPACE::FAILED",
              "Unexpected Newline(\\n) while looking for a non-breaking"
              "_whitespace_");

          return false;
        }
      } // caridge return is ignored
      else if (lexer->lookahead == '\r' || lexer->lookahead == '\f') {
        LOG("WHITESPACE::PEEK", "Found Caridge Return(\\r).");
        found_whitespace = true;
        found_carridge_return_part = true;
        read(lexer);
        mark(lexer);

        continue;
      } // spaces and tabs are used for indentation
      else if (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
        LOG("WHITESPACE::PEEK", "Found spacing(%c).", lexer->lookahead);

        // if were not looking for indentation, spacing, and we dont allow for
        // EOL, then we dont allow for spacing chars.
        if (!looking_for_indentation && !looking_for_spacing &&
            !valid_symbols[LINE_ENDING]) {
          LOG("WHITESPACE::FAILED",
              "Found Unexpected Spacing Character(%c) while NOT looking for "
              "indentation, or while looking for more specific type of "
              "_whitespace_",
              lexer->lookahead);

          return false;
        }

        // found whitespace
        found_whitespace = true;

        // if we're only looking for spacing, then we can continue without
        // needing to count the indents
        if (!looking_for_indentation) {
          LOG("WHITESPACE::LOG",
              "Found spacing(%c) while looking for "
              "_spacing_. EOF ?: %d",
              lexer->lookahead, lexer->eof(lexer));

          read(lexer);
          mark(lexer);

          continue;
        } else {

          // increase the indent
          uint8_t spacing = lexer->lookahead == ' ' ? 1 : 2;
          LOG("WHITESPACE::INDENT",
              "Found spacing(%c) while looking for "
              "_indentation_. \n\t - Increasing indents by %d; From %d to %d",
              lexer->lookahead, spacing, current_indent,
              current_indent + spacing);
          current_indent += spacing;
          read(lexer);
          mark(lexer);

          continue;
        }
      } // anything else breaks out of the loop
      else {
        LOG("WHITESPACE::PEEK",
            "Found Value Character(%c) while looking for "
            "_whitespace_; Breaking out of scan loop.",
            lexer->lookahead);
        break;
      }
    }

    if (result_symbol == ERROR && looking_for_indentation) {
      int current_samedent = VEC_BACK(scanner->indents);
      LOG("INDENTATION::START", "Scanning for _indentation_ vs current: %d.",
          current_samedent);

      if (valid_symbols[INDENT] && current_indent > current_samedent) {
        LOG("INDENTATION::FOUND::++", "Increased Indentation from %d to %d",
            current_samedent, current_indent);
        VEC_PUSH(scanner->indents, current_indent);
        result_symbol = INDENT;
      }

      if (valid_symbols[DEDENT] && current_indent < current_samedent) {
        LOG("INDENTATION::FOUND::--", "Decreased Indentation from %d to %d",
            current_samedent, current_indent);
        VEC_POP(scanner->indents);
        result_symbol = DEDENT;
      }

      if (valid_symbols[SAMEDENT] && current_indent == current_samedent) {
        LOG("INDENTATION::FOUND::==", "Same Indentation of %d found.",
            current_samedent);
        result_symbol = SAMEDENT;
      }
    }

    if (result_symbol != ERROR) {
      lexer->result_symbol = result_symbol;
      mark(lexer);

      return true;
    }
  }

  LOG("WHITESPACE::FAILED", "No valid whitespace matches found.");
  return false;
}

#pragma endregion

#pragma region Tree Sitter API

bool tree_sitter_strux_external_scanner_scan(void *payload, TSLexer *lexer,
                                             const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  LOG("\n===EXTERNAL SCANNER===", ">");
  LOG("> > SCANNER::START",
      "cha: %c, col: %d, indt: %d, lvl: %d, valid_symbols: {", lexer->lookahead,
      lexer->get_column(lexer), VEC_BACK(scanner->indents),
      scanner->indents.len - 1);
  LOG("> > ", "\tNAME: %d", valid_symbols[NAME]);
  LOG("> > ", "\tINDENT: %d", valid_symbols[INDENT]);
  LOG("> > ", "\tDEDENT: %d", valid_symbols[DEDENT]);
  LOG("> > ", "\tSAMEDENT: %d", valid_symbols[SAMEDENT]);
  LOG("> > ", "\tNEWLINE: %d", valid_symbols[NEWLINE]);
  LOG("> > ", "\tLINE_ENDING: %d", valid_symbols[LINE_ENDING]);
  LOG("> > ", "\tEND_OF_FILE: %d", valid_symbols[END_OF_FILE]);
  LOG("> > ", "\tMULTILINE_SPACING: %d", valid_symbols[MULTILINE_SPACING]);
  LOG("> > ", "\tINLINE_SPACING: %d", valid_symbols[INLINE_SPACING]);
  LOG("> > ", "\tERROR: %d", valid_symbols[ERROR]);
  LOG("> > ", "}");

  if (valid_symbols[ERROR]) {
    LOG("< < ERROR::FAILED",
        "Exiting external scanner: Was to attempting to scan for _error_\n");

    return false;
  }

  int8_t name_result = scan_for_name(scanner, lexer, valid_symbols);

  if (name_result == FOUND) {
    LOG("< < NAME::FOUND", "Exiting external scanner.\n");
    return true;
  } else if (name_result == FAILED) {
    LOG("< < NAME::FAILED", "Exiting external scanner.\n");
    return false;
  } else if (name_result == SKIPPED) {
    LOG("NAME::SKIPPED", "Scanning for _whitespace_ after skipping _name_");
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