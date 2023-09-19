// Result types for chunks of the scanner
enum Result {
  // The token was found, successfully
  FOUND = 1,
  // The token was not found, but the scanner should continue
  SKIPPED = 0,
  // The token was not found, and the scanner should abort
  FAILED = -1
};
