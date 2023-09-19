#include "utils/vec.c"
#include <assert.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

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
