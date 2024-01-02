import { WOutCtor } from "../utils/types";

const _SYM = Symbol('_symbol');
const _TRTS = Symbol('_symbol');

export const $ARC = Symbol('arc|Archetype');
export const $PRO = Symbol('pro|Prototype');
export const $NOD = Symbol('nod|Node');
export const $TYP = Symbol('typ|Type');
export const $KEY = Symbol('key|Key');
export const $SCP = Symbol('scp|Scope');
export const $VAR = Symbol('var|Entry');
export const $STX = Symbol('stx|Struct');
export const $TRT = Symbol('trt|Trait');
const $S: ReadonlyMap<symbol, symbol> = new Map();

declare global {
  interface Symbol {
    readonly S: unique symbol;
  }
}

Object.defineProperty(Symbol.prototype, 'S', {
  get: function itr_(this: symbol) {
    const cached = $S.get(this);

    if (cached) {
      return cached;
    }

    const plural
      = Symbol(this.description
        ?.split('|')
        .map(k => `${k}s`)
        .join('|'));

    ($S as Map<symbol, symbol>).set(this, plural);

    return plural;
  }
})

// export function WithTraits<
//   TNode extends typeof Node,
//   TTraits extends Trait[],
// >(
//   node: TNode,
//   traits: TTraits,
// ) {
//   type NTraits = {
//     [key in TTraits[number][typeof _SYM]]: (
//       key extends keyof Traits
//       ? Traits[key]
//       : Trait
//     );
//   }
//   class NNode extends node {
//     protected [_TRTS]: Map<symbol, TTraits[number]> = null!;
//     constructor(...ini: any[]) {
//       super();
//       for (const trait of traits) {
//         this[_TRTS].set(
//           trait[_SYM],
//           new (
//             trait as unknown as TraitConstructor
//           )(
//             this as unknown as INode
//           ) as unknown as TTraits[number]
//         );
//       }
//     }
//   }
//   return NNode as unknown as (NNode & NTraits);
// }

export type IKey
  = Key
  | string
  | number
  | RegExp;

export class Key {
  protected constructor(
    public value: string | number | RegExp
  ) { }
}

export class Index extends Key {
  constructor(
    public readonly value: number
  ) { super(value) }
}

export class Name extends Key {
  constructor(
    public readonly value: string
  ) { super(value) }
}

export class Pattern extends Key {
  constructor(
    public readonly value: RegExp
  ) { super(value) }
}


export abstract class Trait {
  #node: Node;

  static get [_SYM](): symbol {
    return this.prototype[_SYM];
  }

  abstract get [_SYM](): symbol;

  get [$NOD](): Node {
    return this.#node;
  }

  get [$TRT](): Trait {
    return this;
  }

  constructor(node: Node) {
    this.#node = node;
  }
}

export type TraitConstructor
  = WOutCtor<typeof Trait>
  & {
    readonly [_SYM]: symbol
    new(...args: any[]): Trait
  }

export type HasTrait<TTrait extends TraitConstructor> = {
  [traitKey in TTrait[typeof _SYM]]: (
    (traitKey extends keyof Traits
      ? Traits[traitKey]
      : Trait)
  );
}

export class Entry extends Trait {

  static get [_SYM](): typeof $VAR {
    return $VAR;
  }

  get [_SYM](): typeof $VAR {
    return $VAR;
  }

  get source(): Struct {
    throw new Error('Member not implemented.');
  }
}

export class Struct extends Trait {
  static get [_SYM](): typeof $STX {
    return $STX;
  }

  get [_SYM](): typeof $STX {
    return $STX;
  }

  get own(): Map<Key, Entry[]> {
    throw new Error('Member not implemented.');
  }
}

export type Traits
  = typeof TRAITS;

export const TRAITS
  = {
    [$VAR]: Entry,
    [$STX]: Struct,
  } as const;

export const KEYS: Map<typeof Trait, symbol>
  = new Map([
    [Trait, $TRT],
    [Entry, $VAR]
  ]);

const $
  = function <TTrait extends TraitConstructor>(trait: TTrait) {
    return <TNode extends NodeConstructor>(target: TNode) => {
      target.prototype[_TRTS].set(new trait());
      return target as TNode & HasTrait<TTrait>;
    }
  }

export type NodeConstructor<TNode extends Node = Node> = {
  new(...args: any[]): TNode;
};

export type INode = {
  [traitKey in keyof Traits]?: Traits[traitKey];
}

@$(Struct)
@$(Entry)
export class Node implements INode {
  constructor() {
    /** @ts-expect-error */
    this[_TRTS] = new Map<symbol, Trait>();
  }
}