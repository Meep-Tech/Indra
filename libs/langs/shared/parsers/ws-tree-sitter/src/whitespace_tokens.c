// can be modified to add after existing tokens
const int FIRST_WHITESPACE_TOKEN_ID = 0;

// Token types the internal scanner can return
enum WhitespaceTokenType {
  // optional multiline spacing followed by an increase in
  // indentation at the start of the next line with content.
  INDENT = FIRST_WHITESPACE_TOKEN_ID,
  // optional multiline spacing followed by a decrease in indentation
  // at the start of the next line with content.
  DEDENT,
  // optional multiline spacing followed by the same indentation at
  // the start of the next line with content.
  SAMEDENT,

  // [\n]|[\r\n]|[\r\n]
  NEWLINE,
  // optional inline spacing followed by a newline or end of file
  LINE_ENDING,
  // eof
  END_OF_FILE,
  // \0
  NULL_CHARACTER,

  // [ \t\n\r\f]*
  MULTILINE_SPACING,
  // [ \t]+
  INLINE_SPACING,
};
