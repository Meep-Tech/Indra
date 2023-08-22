import label from './label';

namespace Tag {
  export type Label = label;
  export type Type = Tag;
  export type s = Tags;
  export type S = Tags;
  export type OrTags = TagOrTags;
  export type _s = TagOrTags;
  export type _S = TagOrTags;
}

type Tag
  = string | number | symbol | label;

export type { Tag }
export default Tag;

export type Tags
  = Iterable<Tag>;
export type TagOrTags
  = Tag | Tags;

export type {
  TagOrTags as Tag_s,
  Tags as DexTags,
}