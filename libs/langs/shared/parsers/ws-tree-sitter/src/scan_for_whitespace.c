#include "../tree_sitter/parser.h"
#include "indent_vec.c"
#include "utils/lexer.c"
#include "utils/result.c"
#include "utils/vec.c"
#include "whitespace_tokens.c"
#include <stdbool.h>

/// @brief The scanner struct, with the indent vector data
typedef struct {
  indent_vec indents;
} Scanner;

/// @breif This struct keeps track of the current state of the scanner, and
/// holds some optional debug data
typedef struct {
  /// @brief If any chars have been scanned
  bool has_scanned_chars;

  /// @brief The number of total scanned chars
  int number_of_chars_scanned;

  /// @brief The current scanned indentation level
  int scanned_indent;

  /// @brief If any whitespace chars have been found
  bool found_whitespace_char;

  /// @brief If any value chars have been found
  bool found_value_char;

  /// @brief Number of total skipped chars
  bool found_carridge_return_part;

  /// @brief The symbol that was found (-1 if none)
  int result_symbol;

  /// @brief String of chars that have been skipped before the first scanned
  /// char
  char *skipped_before_chars;

  /// @brief String of chars that have been scanned
  char *scanned_chars;

  /// @brief String of chars that have been marked 'end'
  char *consumed_chars;

  /// @brief If any chars have been consumed
  bool has_consumed_chars;

  /// @brief Number of total consumed chars
  int number_of_chars_consumed;

  /// @brief String of chars that have been skipped after the last scanned char
  char *skipped_after_chars;
} WhitespaceScannerStats;

// @brief Creates a new whitespace scanner stats struct
WhitespaceScannerStats new_ws_scanner_stats() {
  WhitespaceScannerStats stats = {
      .number_of_chars_scanned = 0,
      .has_scanned_chars = false,
      .scanned_indent = 0,
      .has_consumed_chars = false,
      .found_value_char = false,
      .number_of_chars_consumed = 0,
      .found_whitespace_char = false,
      .found_carridge_return_part = false,
      .result_symbol = -1,
      .skipped_before_chars =
          DEBUG ? (char *)malloc(sizeof(char) * 1024) : NULL,
      .scanned_chars = DEBUG ? (char *)malloc(sizeof(char) * 1024) : NULL,
      .skipped_after_chars =
          DEBUG ? (char *)malloc(sizeof(char) * 1024) : NULL,
      .consumed_chars = NULL,
  };

  return stats;
}

/// @brief format a json like string of the stats
#define SCANNER_STATS                                                          \
  "{ "                                                                         \
                                                                               \
  "\n\tcurrent_char: '%c', "                                                   \
  "\n\tcurrent_column: '%d', "                                                 \
                                                                               \
  "\n\tscanned_indent: '%d', "                                                 \
  "\n\tcurrent_indent: '%d', "                                                 \
  "\n\tcurrent_indent_level: '%d', "                                           \
                                                                               \
  "\n\tfound_whitespace: '%d', "                                               \
  "\n\tfound_carridge_return_part: '%d', "                                     \
  "\n\tfound_value_char: '%d',"                                                \
                                                                               \
  "\n\thas_scanned_chars: '%d', "                                              \
  "\n\tnumber_of_chars_scanned: '%d', "                                        \
  "\n\tskipped_before_chars: '%s', "                                           \
  "\n\tscanned_chars: '%s', "                                                  \
  "\n\tskipped_after_chars: '%s' "                                             \
                                                                               \
  "\n\thas_consumed_chars: '%d', "                                             \
  "\n\tnumber_of_chars_consumed: '%d', "                                       \
  "\n\tconsumed_chars: '%s', "                                                 \
                                                                               \
  "\n\tresult_symbol: '%d', "                                                  \
                                                                               \
  "%s}",                                                                       \
      lexer->lookahead, lexer->get_column(lexer),                              \
                                                                               \
      stats.scanned_indent, VEC_BACK(scanner->indents),                        \
      scanner->indents.len - 1,                                                \
                                                                               \
      stats.found_whitespace_char, stats.found_carridge_return_part,           \
      stats.found_value_char,                                                  \
                                                                               \
      stats.has_scanned_chars, stats.number_of_chars_scanned,                  \
      stats.skipped_before_chars, stats.scanned_chars,                         \
      stats.skipped_after_chars,                                               \
                                                                               \
      stats.has_consumed_chars, stats.number_of_chars_consumed,                \
      stats.consumed_chars,                                                    \
                                                                               \
      stats.result_symbol,

/// @brief Logs the current stats struct
#define LOG_STATS LOG("- STATS", SCANNER_STATS);

/// @brief Logs a message along with the current stats
#define LOG_WITH_STATS(K, M, ...)                                              \
  LOG(K, M, ##__VA_ARGS__);                                                    \
  LOG_STATS;

/// @brief updates the stats for a read char
void update_ws_scanner_stats_for_read(TSLexer *lexer,
                                      WhitespaceScannerStats stats) {
  stats.has_scanned_chars = true;
  if (DEBUG) {
    stats.number_of_chars_scanned++;
    stats.scanned_chars[strlen(stats.scanned_chars)] = lexer->lookahead;
  }
}

/// @brief updates the stats for a skipped char
void update_ws_scanner_stats_for_skip(TSLexer *lexer,
                                      WhitespaceScannerStats stats) {
  stats.has_scanned_chars = true;
  if (DEBUG) {
    stats.number_of_chars_scanned++;
    if (stats.scanned_chars[strlen(stats.scanned_chars)] != '\0') {
      stats.skipped_before_chars[strlen(stats.scanned_chars)] =
          lexer->lookahead;
    } else {
      stats.skipped_before_chars[strlen(stats.skipped_before_chars)] =
          lexer->lookahead;
    }
  }
}

/// @brief updates the stats for mark_end
void update_ws_scanner_stats_for_end(TSLexer *lexer,
                                     WhitespaceScannerStats stats) {

  if (stats.has_scanned_chars) {
    stats.has_consumed_chars = true;
  }

  if (DEBUG) {
    // combined all scanned chars into one string
    stats.consumed_chars = (char *)malloc(sizeof(char) * 1024);
    strcpy(stats.consumed_chars, stats.skipped_before_chars);
    strcat(stats.consumed_chars, stats.scanned_chars);
    strcat(stats.consumed_chars, stats.skipped_after_chars);

    stats.number_of_chars_consumed = strlen(stats.consumed_chars);
  }
}

/// @brief prompts the lexer to read the next char
#define LEX_READ                                                               \
  update_ws_scanner_stats_for_read(lexer, stats);                              \
  read(lexer);                                                                 \
  LOG_STATS;

/// @brief prompts the lexer to skip the next char
#define LEX_SKIP                                                               \
  update_ws_scanner_stats_for_skip(lexer, stats);                              \
  skip(lexer);                                                                 \
  LOG_STATS;

/// @brief prompts the lexer to end
#define LEX_END                                                                \
  update_ws_scanner_stats_for_end(lexer, stats);                               \
  end(lexer);                                                                  \
  LOG_STATS;

enum Result scan_for_whitespace(Scanner *scanner, TSLexer *lexer,
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
    WhitespaceScannerStats stats = new_ws_scanner_stats();
    LOG("WHITESPACE::START", "Scanning for:");
    LOG("\t - INDENT:\t\t", "%d", valid_symbols[INDENT]);
    LOG("\t - DEDENT:\t\t", "%d", valid_symbols[DEDENT]);
    LOG("\t - SAMEDENT:\t\t", "%d", valid_symbols[SAMEDENT]);
    LOG("\t - NEWLINE:\t\t", "%d", valid_symbols[NEWLINE]);
    LOG("\t - LINE_ENDING:\t\t", "%d", valid_symbols[LINE_ENDING]);
    LOG("\t - END_OF_FILE:\t\t", "%d", valid_symbols[END_OF_FILE]);
    LOG("\t - NULL_CHARACTER:\t\t", "%d", valid_symbols[NULL_CHARACTER]);
    LOG("\t - MULTILINE_SPACING:\t\t", "%d", valid_symbols[MULTILINE_SPACING]);
    LOG("\t - INLINE_SPACING:\t\t", "%d", valid_symbols[INLINE_SPACING]);

    // NULL_CHAR found before anything else
    if (!lexer->lookahead) {
      LOG_WITH_STATS("WHITESPACE::PEEK", "Found \\0 (NULL_CHAR).");

      enum Result result;
      if (valid_symbols[NULL_CHARACTER]) {
        LOG("WHITESPACE::FOUND", "Successfully found NULL_CHARACTER.");

        LEX_READ;
        lexer->result_symbol = NULL_CHARACTER;
        result = FOUND;
        // } else if (valid_symbols[END_OF_FILE]) {
        //   LOG("WHITESPACE::FOUND", "Successfully found END_OF_FILE");

        //   lexer->result_symbol = END_OF_FILE;
        //   return FOUND;
        // } else if (valid_symbols[LINE_ENDING]) {
        //   LOG("WHITESPACE::FOUND",
        //       "Successfully found _line_ending_ while looking "
        //       "for _whitespace_");

        //   lexer->result_symbol = LINE_ENDING;
        //   return FOUND;
      } else {
        LOG("WHITESPACE::SKIPPED", "Unexpected NULL_CHARACTER.");

        result = SKIPPED;
      }

      return result;
    }

    while (lexer->lookahead) {
      // end of file breaks out of the loop
      if (lexer->eof(lexer)) {
        LOG_WITH_STATS("WHITESPACE::PEEK", "Found EOF.");

        // eof is most specific
        if (valid_symbols[END_OF_FILE] && !stats.found_whitespace_char) {
          LOG("WHITESPACE::FOUND", "Successfully found END_OF_FILE.");

          stats.result_symbol = END_OF_FILE;
        } // end of file isnt as specific as EOL
        else if (valid_symbols[LINE_ENDING]) {
          LOG("WHITESPACE::FOUND", "Successfully found LINE_ENDING.");

          stats.result_symbol = LINE_ENDING;
        } // newline is even less specific
        // else if (valid_symbols[NEWLINE] && !found_whitespace_char) {
        //   LOG("WHITESPACE::FOUND", "Successfully found _newline_ while"
        //   "looking for _whitespace_");
        //   result_symbol = NEWLINE;
        // } // indentation is least specific when it comes to eof
        else if (looking_for_indentation) {
          // TODO: try having this return false if we cant get indents to work
          // with eof.
          LOG("WHITESPACE::INDENT",
              "Found EOF while looking_for_indentation == true. "
              "\n- Resetting indents from %d to 0",
              stats.scanned_indent);

          stats.scanned_indent = 0;
        }

        LOG_STATS;
        break;
      } // newline char is handled in a special way
      else if (lexer->lookahead == '\n') {
        LOG_WITH_STATS("WHITESPACE::PEEK", "Found Newline(\\n).");

        // newline char is most specific
        if (valid_symbols[NEWLINE] && !stats.found_whitespace_char) {
          stats.result_symbol = NEWLINE;
          LEX_READ;
          LEX_END;

          // check for a tailing carridge return
          if (lexer->lookahead == '\r') {
            LOG_WITH_STATS("WHITESPACE::PEEK",
                           "Found Optional trailing Caridge Return "
                           "(\\r).");

            LEX_READ;
            LEX_END;
          }

          LOG("WHITESPACE::FOUND", "Successfully found NEWLINE.");
          break;
        } // newline isnt as specific as EOL
        else if (valid_symbols[LINE_ENDING]) {
          stats.result_symbol = LINE_ENDING;
          LEX_READ;
          LEX_END;

          // check for a tailing carridge return
          if (lexer->lookahead == '\r' && !stats.found_carridge_return_part) {
            LOG_WITH_STATS("WHITESPACE::PEEK",
                           "Found Optional trailing Caridge Return "
                           "(\\r).");
            LEX_READ;
            LEX_END;
          }

          LOG("WHITESPACE::FOUND", "Successfully found LINE_ENDING.");
          break;
        } // newlines reset the indent
        else if (looking_for_indentation) {
          LOG("WHITESPACE::INDENT",
              "Found Newline(\\n) while looking_for_indentation == true. \n- "
              "Resetting indents from %d to 0",
              stats.scanned_indent);
          stats.found_whitespace_char = true;
          stats.scanned_indent = 0;
          LEX_READ;
          LEX_END;

          continue;
        } // newlines are allowed if looking for any whitespace
        else if (valid_symbols[MULTILINE_SPACING]) {
          LOG("WHITESPACE::CONTINUE", "Found Newline(\\n) while looking for "
                                      "MULTILINE_SPACING.");
          stats.found_whitespace_char = true;
          LEX_READ;
          LEX_END;

          continue;
        } // not looking for anything that matches or allows for a newline
        else {
          LOG("WHITESPACE::FAILED",
              "Unexpected Newline(\\n) while looking for a non-breaking"
              "whitespace token.");

          return stats.has_consumed_chars ? FAILED : SKIPPED;
        }
      } // caridge return is ignored
      else if (lexer->lookahead == '\r' || lexer->lookahead == '\f') {
        LOG_WITH_STATS("WHITESPACE::PEEK", "Found Caridge Return(\\r).");
        stats.found_whitespace_char = true;
        stats.found_carridge_return_part = true;
        LEX_READ;
        LEX_END;

        continue;
      } // spaces and tabs are used for indentation
      else if (lexer->lookahead == ' ' || lexer->lookahead == '\t') {
        LOG_WITH_STATS("WHITESPACE::PEEK", "Found spacing charachter: (%c).",
                       lexer->lookahead);

        // if were not looking for indentation, spacing, and we dont allow for
        // EOL, then we dont allow for spacing chars.
        if (!looking_for_indentation && !looking_for_spacing &&
            !valid_symbols[LINE_ENDING]) {
          LOG("WHITESPACE::FAILED",
              "Found Unexpected Spacing Character(%c) while NOT looking for "
              "indentation, or while looking for more specific type of "
              "whitespace.",
              lexer->lookahead);

          return stats.has_consumed_chars ? FAILED : SKIPPED;
        }

        // found whitespace
        stats.found_whitespace_char = true;

        // if we're only looking for spacing, then we can continue without
        // needing to count the indents
        if (!looking_for_indentation && looking_for_spacing) {
          LOG("WHITESPACE::CONTINUE",
              "Found spacing(%c) while looking_for_spacing == true and "
              "looking_for_indentation == false.",
              lexer->lookahead);

          LEX_READ;
          LEX_END;
        } else {
          // increase the indent
          uint8_t spacing = lexer->lookahead == ' ' ? 1 : 2;
          LOG("WHITESPACE::INDENT",
              "Found spacing(%c) while looking_for_indentation == true. \n- "
              "Increasing indents by %d; From %d to %d",
              lexer->lookahead, spacing, stats.scanned_indent,
              stats.scanned_indent + spacing);
          stats.scanned_indent += spacing;

          LEX_READ;
          LEX_END;
        }

        continue;
      } // anything else breaks out of the loop
      else {
        LOG("WHITESPACE::PEEK",
            "Found Value Character(%c) while looking for "
            "whitespace; Breaking out of scan loop.",
            lexer->lookahead);
        stats.found_value_char = true;
        LOG_STATS

        break;
      }
    }

    if (stats.result_symbol == -1 && looking_for_indentation) {
      int current_samedent = VEC_BACK(scanner->indents);
      LOG_WITH_STATS(
          "INDENTATION::START",
          "Scanning for indentation tokens vs current samedent of: %d.",
          current_samedent);

      if (valid_symbols[INDENT] && stats.scanned_indent > current_samedent) {
        LOG("INDENTATION::FOUND::++", "Increased Indentation from %d to %d",
            current_samedent, stats.scanned_indent);
        VEC_PUSH(scanner->indents, stats.scanned_indent);
        stats.result_symbol = INDENT;
      }

      if (valid_symbols[DEDENT] && stats.scanned_indent < current_samedent) {
        LOG("INDENTATION::FOUND::--", "Decreased Indentation from %d to %d",
            current_samedent, stats.scanned_indent);
        VEC_POP(scanner->indents);
        stats.result_symbol = DEDENT;
      }

      if (valid_symbols[SAMEDENT] && stats.scanned_indent == current_samedent) {
        LOG("INDENTATION::FOUND::==", "Same Indentation of %d found.",
            current_samedent);
        stats.result_symbol = SAMEDENT;
      }

      LOG_STATS;
    }

    if (stats.result_symbol != -1) {
      lexer->result_symbol = stats.result_symbol;
      LOG_WITH_STATS("WHITESPACE::FOUND", "Successfully found whitespace.");

      return FOUND;
    }

    LOG_WITH_STATS("WHITESPACE::%s",
                   "Did not find any matching whitespace tokens.",
                   stats.has_consumed_chars ? "FAILED" : "SKIPPED");
    return stats.has_consumed_chars ? FAILED : SKIPPED;
  }

  LOG("WHITESPACE::SKIPPED", "Not looking for whitespace.");
  return SKIPPED;
}
