#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 18
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 29
#define ALIAS_COUNT 0
#define TOKEN_COUNT 17
#define EXTERNAL_TOKEN_COUNT 5
#define FIELD_COUNT 3
#define MAX_ALIAS_SEQUENCE_LENGTH 3
#define PRODUCTION_ID_COUNT 3

enum {
  sym__nbwsps = 1,
  sym__nbwsp_s = 2,
  sym_assignment_operator = 3,
  sym__trait_indicator = 4,
  sym__input_indicator = 5,
  sym_protected_affix = 6,
  sym_internal_affix = 7,
  sym_private_affix = 8,
  sym__name_first_char = 9,
  aux_sym__name_rest_chars_token1 = 10,
  anon_sym_POUND = 11,
  sym__name_ = 12,
  sym__indent_ = 13,
  sym__dedent_ = 14,
  sym__samedent_ = 15,
  sym__newline_ = 16,
  sym_src = 17,
  sym_current_indent = 18,
  sym_indent = 19,
  sym__struct = 20,
  sym_map = 21,
  aux_sym__multiline_map = 22,
  sym__multiline_map_entry = 23,
  sym__multiline_map_named_entry = 24,
  sym_name = 25,
  sym__inline_value = 26,
  sym__multiline_value = 27,
  sym_literal = 28,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [sym__nbwsps] = "_nbwsps",
  [sym__nbwsp_s] = "_nbwsp_s",
  [sym_assignment_operator] = "assignment_operator",
  [sym__trait_indicator] = "_trait_indicator",
  [sym__input_indicator] = "_input_indicator",
  [sym_protected_affix] = "protected_affix",
  [sym_internal_affix] = "internal_affix",
  [sym_private_affix] = "private_affix",
  [sym__name_first_char] = "_name_first_char",
  [aux_sym__name_rest_chars_token1] = "_name_rest_chars_token1",
  [anon_sym_POUND] = "#",
  [sym__name_] = "_name_",
  [sym__indent_] = "_indent_",
  [sym__dedent_] = "_dedent_",
  [sym__samedent_] = "_samedent_",
  [sym__newline_] = "_newline_",
  [sym_src] = "src",
  [sym_current_indent] = "current_indent",
  [sym_indent] = "indent",
  [sym__struct] = "_struct",
  [sym_map] = "map",
  [aux_sym__multiline_map] = "_multiline_map",
  [sym__multiline_map_entry] = "_multiline_map_entry",
  [sym__multiline_map_named_entry] = "named_entry",
  [sym_name] = "name",
  [sym__inline_value] = "_inline_value",
  [sym__multiline_value] = "_multiline_value",
  [sym_literal] = "literal",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [sym__nbwsps] = sym__nbwsps,
  [sym__nbwsp_s] = sym__nbwsp_s,
  [sym_assignment_operator] = sym_assignment_operator,
  [sym__trait_indicator] = sym__trait_indicator,
  [sym__input_indicator] = sym__input_indicator,
  [sym_protected_affix] = sym_protected_affix,
  [sym_internal_affix] = sym_internal_affix,
  [sym_private_affix] = sym_private_affix,
  [sym__name_first_char] = sym__name_first_char,
  [aux_sym__name_rest_chars_token1] = aux_sym__name_rest_chars_token1,
  [anon_sym_POUND] = anon_sym_POUND,
  [sym__name_] = sym__name_,
  [sym__indent_] = sym__indent_,
  [sym__dedent_] = sym__dedent_,
  [sym__samedent_] = sym__samedent_,
  [sym__newline_] = sym__newline_,
  [sym_src] = sym_src,
  [sym_current_indent] = sym_current_indent,
  [sym_indent] = sym_indent,
  [sym__struct] = sym__struct,
  [sym_map] = sym_map,
  [aux_sym__multiline_map] = aux_sym__multiline_map,
  [sym__multiline_map_entry] = sym__multiline_map_entry,
  [sym__multiline_map_named_entry] = sym__multiline_map_named_entry,
  [sym_name] = sym_name,
  [sym__inline_value] = sym__inline_value,
  [sym__multiline_value] = sym__multiline_value,
  [sym_literal] = sym_literal,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [sym__nbwsps] = {
    .visible = false,
    .named = true,
  },
  [sym__nbwsp_s] = {
    .visible = false,
    .named = true,
  },
  [sym_assignment_operator] = {
    .visible = true,
    .named = true,
  },
  [sym__trait_indicator] = {
    .visible = false,
    .named = true,
  },
  [sym__input_indicator] = {
    .visible = false,
    .named = true,
  },
  [sym_protected_affix] = {
    .visible = true,
    .named = true,
  },
  [sym_internal_affix] = {
    .visible = true,
    .named = true,
  },
  [sym_private_affix] = {
    .visible = true,
    .named = true,
  },
  [sym__name_first_char] = {
    .visible = false,
    .named = true,
  },
  [aux_sym__name_rest_chars_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_POUND] = {
    .visible = true,
    .named = false,
  },
  [sym__name_] = {
    .visible = false,
    .named = true,
  },
  [sym__indent_] = {
    .visible = false,
    .named = true,
  },
  [sym__dedent_] = {
    .visible = false,
    .named = true,
  },
  [sym__samedent_] = {
    .visible = false,
    .named = true,
  },
  [sym__newline_] = {
    .visible = false,
    .named = true,
  },
  [sym_src] = {
    .visible = true,
    .named = true,
  },
  [sym_current_indent] = {
    .visible = true,
    .named = true,
  },
  [sym_indent] = {
    .visible = true,
    .named = true,
  },
  [sym__struct] = {
    .visible = false,
    .named = true,
  },
  [sym_map] = {
    .visible = true,
    .named = true,
  },
  [aux_sym__multiline_map] = {
    .visible = false,
    .named = false,
  },
  [sym__multiline_map_entry] = {
    .visible = false,
    .named = true,
  },
  [sym__multiline_map_named_entry] = {
    .visible = true,
    .named = true,
  },
  [sym_name] = {
    .visible = true,
    .named = true,
  },
  [sym__inline_value] = {
    .visible = false,
    .named = true,
  },
  [sym__multiline_value] = {
    .visible = false,
    .named = true,
  },
  [sym_literal] = {
    .visible = true,
    .named = true,
  },
};

enum {
  field_key = 1,
  field_operator = 2,
  field_value = 3,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_key] = "key",
  [field_operator] = "operator",
  [field_value] = "value",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 3},
  [2] = {.index = 3, .length = 3},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_key, 1, .inherited = true},
    {field_operator, 1, .inherited = true},
    {field_value, 1, .inherited = true},
  [3] =
    {field_key, 0},
    {field_operator, 1},
    {field_value, 2},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(3);
      if (lookahead == '#') ADVANCE(15);
      if (lookahead == '$') ADVANCE(6);
      if (lookahead == '/') ADVANCE(12);
      if (lookahead == ':') ADVANCE(13);
      if (lookahead == '>') ADVANCE(7);
      if (lookahead == '_') ADVANCE(8);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '.' &&
          lookahead != '^') ADVANCE(11);
      END_STATE();
    case 1:
      if (lookahead == ':') ADVANCE(2);
      END_STATE();
    case 2:
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(5);
      END_STATE();
    case 3:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 4:
      ACCEPT_TOKEN(sym__nbwsps);
      if (lookahead == '/') ADVANCE(4);
      END_STATE();
    case 5:
      ACCEPT_TOKEN(sym_assignment_operator);
      END_STATE();
    case 6:
      ACCEPT_TOKEN(sym__trait_indicator);
      END_STATE();
    case 7:
      ACCEPT_TOKEN(sym__input_indicator);
      END_STATE();
    case 8:
      ACCEPT_TOKEN(sym_protected_affix);
      if (lookahead == '_') ADVANCE(9);
      END_STATE();
    case 9:
      ACCEPT_TOKEN(sym_internal_affix);
      if (lookahead == '_') ADVANCE(10);
      END_STATE();
    case 10:
      ACCEPT_TOKEN(sym_private_affix);
      END_STATE();
    case 11:
      ACCEPT_TOKEN(sym__name_first_char);
      END_STATE();
    case 12:
      ACCEPT_TOKEN(sym__name_first_char);
      if (lookahead == '\t' ||
          lookahead == ' ') ADVANCE(4);
      END_STATE();
    case 13:
      ACCEPT_TOKEN(sym__name_first_char);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') ADVANCE(5);
      END_STATE();
    case 14:
      ACCEPT_TOKEN(aux_sym__name_rest_chars_token1);
      if (lookahead != 0 &&
          lookahead != '\n') ADVANCE(14);
      END_STATE();
    case 15:
      ACCEPT_TOKEN(anon_sym_POUND);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0, .external_lex_state = 1},
  [1] = {.lex_state = 0, .external_lex_state = 2},
  [2] = {.lex_state = 14, .external_lex_state = 3},
  [3] = {.lex_state = 14, .external_lex_state = 2},
  [4] = {.lex_state = 0, .external_lex_state = 2},
  [5] = {.lex_state = 0, .external_lex_state = 2},
  [6] = {.lex_state = 0, .external_lex_state = 2},
  [7] = {.lex_state = 0, .external_lex_state = 4},
  [8] = {.lex_state = 0, .external_lex_state = 2},
  [9] = {.lex_state = 14, .external_lex_state = 2},
  [10] = {.lex_state = 0, .external_lex_state = 2},
  [11] = {.lex_state = 0, .external_lex_state = 2},
  [12] = {.lex_state = 0, .external_lex_state = 2},
  [13] = {.lex_state = 0, .external_lex_state = 4},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 0},
  [16] = {.lex_state = 1},
  [17] = {.lex_state = 1},
};

enum {
  ts_external_token__name_ = 0,
  ts_external_token__indent_ = 1,
  ts_external_token__dedent_ = 2,
  ts_external_token__samedent_ = 3,
  ts_external_token__newline_ = 4,
};

static const TSSymbol ts_external_scanner_symbol_map[EXTERNAL_TOKEN_COUNT] = {
  [ts_external_token__name_] = sym__name_,
  [ts_external_token__indent_] = sym__indent_,
  [ts_external_token__dedent_] = sym__dedent_,
  [ts_external_token__samedent_] = sym__samedent_,
  [ts_external_token__newline_] = sym__newline_,
};

static const bool ts_external_scanner_states[5][EXTERNAL_TOKEN_COUNT] = {
  [1] = {
    [ts_external_token__name_] = true,
    [ts_external_token__indent_] = true,
    [ts_external_token__dedent_] = true,
    [ts_external_token__samedent_] = true,
    [ts_external_token__newline_] = true,
  },
  [2] = {
    [ts_external_token__samedent_] = true,
  },
  [3] = {
    [ts_external_token__indent_] = true,
  },
  [4] = {
    [ts_external_token__name_] = true,
  },
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [sym__nbwsps] = ACTIONS(1),
    [sym__nbwsp_s] = ACTIONS(1),
    [sym_assignment_operator] = ACTIONS(1),
    [sym__trait_indicator] = ACTIONS(1),
    [sym__input_indicator] = ACTIONS(1),
    [sym_protected_affix] = ACTIONS(1),
    [sym_internal_affix] = ACTIONS(1),
    [sym_private_affix] = ACTIONS(1),
    [sym__name_first_char] = ACTIONS(1),
    [anon_sym_POUND] = ACTIONS(1),
    [sym__name_] = ACTIONS(1),
    [sym__indent_] = ACTIONS(1),
    [sym__dedent_] = ACTIONS(1),
    [sym__samedent_] = ACTIONS(1),
    [sym__newline_] = ACTIONS(1),
  },
  [1] = {
    [sym_src] = STATE(14),
    [sym_current_indent] = STATE(7),
    [sym__struct] = STATE(15),
    [sym_map] = STATE(15),
    [aux_sym__multiline_map] = STATE(4),
    [sym__multiline_map_entry] = STATE(4),
    [sym__samedent_] = ACTIONS(3),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 4,
    ACTIONS(5), 1,
      aux_sym__name_rest_chars_token1,
    ACTIONS(7), 1,
      sym__indent_,
    STATE(3), 1,
      sym_indent,
    STATE(11), 3,
      sym__inline_value,
      sym__multiline_value,
      sym_literal,
  [15] = 5,
    ACTIONS(3), 1,
      sym__samedent_,
    ACTIONS(5), 1,
      aux_sym__name_rest_chars_token1,
    STATE(7), 1,
      sym_current_indent,
    STATE(12), 1,
      sym_literal,
    STATE(6), 2,
      aux_sym__multiline_map,
      sym__multiline_map_entry,
  [32] = 4,
    ACTIONS(3), 1,
      sym__samedent_,
    ACTIONS(9), 1,
      ts_builtin_sym_end,
    STATE(7), 1,
      sym_current_indent,
    STATE(5), 2,
      aux_sym__multiline_map,
      sym__multiline_map_entry,
  [46] = 4,
    ACTIONS(11), 1,
      ts_builtin_sym_end,
    ACTIONS(13), 1,
      sym__samedent_,
    STATE(7), 1,
      sym_current_indent,
    STATE(5), 2,
      aux_sym__multiline_map,
      sym__multiline_map_entry,
  [60] = 4,
    ACTIONS(3), 1,
      sym__samedent_,
    ACTIONS(16), 1,
      ts_builtin_sym_end,
    STATE(7), 1,
      sym_current_indent,
    STATE(5), 2,
      aux_sym__multiline_map,
      sym__multiline_map_entry,
  [74] = 3,
    ACTIONS(18), 1,
      sym__name_,
    STATE(8), 1,
      sym__multiline_map_named_entry,
    STATE(17), 1,
      sym_name,
  [84] = 1,
    ACTIONS(20), 2,
      sym__samedent_,
      ts_builtin_sym_end,
  [89] = 1,
    ACTIONS(22), 2,
      sym__samedent_,
      aux_sym__name_rest_chars_token1,
  [94] = 1,
    ACTIONS(24), 2,
      sym__samedent_,
      ts_builtin_sym_end,
  [99] = 1,
    ACTIONS(26), 2,
      sym__samedent_,
      ts_builtin_sym_end,
  [104] = 1,
    ACTIONS(16), 2,
      sym__samedent_,
      ts_builtin_sym_end,
  [109] = 1,
    ACTIONS(28), 1,
      sym__name_,
  [113] = 1,
    ACTIONS(30), 1,
      ts_builtin_sym_end,
  [117] = 1,
    ACTIONS(32), 1,
      ts_builtin_sym_end,
  [121] = 1,
    ACTIONS(34), 1,
      sym_assignment_operator,
  [125] = 1,
    ACTIONS(36), 1,
      sym_assignment_operator,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 15,
  [SMALL_STATE(4)] = 32,
  [SMALL_STATE(5)] = 46,
  [SMALL_STATE(6)] = 60,
  [SMALL_STATE(7)] = 74,
  [SMALL_STATE(8)] = 84,
  [SMALL_STATE(9)] = 89,
  [SMALL_STATE(10)] = 94,
  [SMALL_STATE(11)] = 99,
  [SMALL_STATE(12)] = 104,
  [SMALL_STATE(13)] = 109,
  [SMALL_STATE(14)] = 113,
  [SMALL_STATE(15)] = 117,
  [SMALL_STATE(16)] = 121,
  [SMALL_STATE(17)] = 125,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(9),
  [9] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_map, 1),
  [11] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym__multiline_map, 2),
  [13] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym__multiline_map, 2), SHIFT_REPEAT(13),
  [16] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__multiline_value, 2),
  [18] = {.entry = {.count = 1, .reusable = true}}, SHIFT(16),
  [20] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__multiline_map_entry, 2, .production_id = 1),
  [22] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_indent, 1),
  [24] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_literal, 1),
  [26] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym__multiline_map_named_entry, 3, .production_id = 2),
  [28] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_current_indent, 1),
  [30] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [32] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_src, 1),
  [34] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_name, 1),
  [36] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
};

#ifdef __cplusplus
extern "C" {
#endif
void *tree_sitter_strux_external_scanner_create(void);
void tree_sitter_strux_external_scanner_destroy(void *);
bool tree_sitter_strux_external_scanner_scan(void *, TSLexer *, const bool *);
unsigned tree_sitter_strux_external_scanner_serialize(void *, char *);
void tree_sitter_strux_external_scanner_deserialize(void *, const char *, unsigned);

#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_strux(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .external_scanner = {
      &ts_external_scanner_states[0][0],
      ts_external_scanner_symbol_map,
      tree_sitter_strux_external_scanner_create,
      tree_sitter_strux_external_scanner_destroy,
      tree_sitter_strux_external_scanner_scan,
      tree_sitter_strux_external_scanner_serialize,
      tree_sitter_strux_external_scanner_deserialize,
    },
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
