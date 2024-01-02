export type IsEmpty<Obj extends Record<PropertyKey, unknown>>
  = [keyof Obj] extends [never] ? true : false;

export type OrNone<Obj extends Record<PropertyKey, unknown>>
  = IsEmpty<Obj> extends true ? undefined : Obj;

export type KeysWOutCtor<T> = ({
  [P in keyof T]: (T[P] extends new () => any
    ? never
    : P)
})[keyof T];

export type WOutCtor<T>
  = Pick<T, KeysWOutCtor<T>>;