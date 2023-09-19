#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

bool is_debug() { return getenv("TREE_SITTER_DEBUG"); }
#define DEBUG is_debug()

// Set to true for Logging:
#define LOGGING true

// Logging Macro (Debug mode only)
#if LOGGING == true
#define LOG(K, M, ...)                                                         \
  if (DEBUG) {                                                                 \
    fprintf(stdout, K " - " M "\n", ##__VA_ARGS__);                            \
  }
#else
#define LOG(...)                                                               \
  do {                                                                         \
  } while (0)
#endif
