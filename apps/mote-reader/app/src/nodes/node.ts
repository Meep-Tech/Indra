

export interface Type<
  TArchetype extends INode | undefined = any,
  TPrototype extends INode | undefined = any
> {
  get [$KEY](): string;
  get [$ARC](): TArchetype | undefined;
  get [$PRO](): TPrototype | undefined;
  get [$TYP](): this;
  new(...args: any[]): INode<TPrototype, TArchetype>;
  get Type(): NodeConstructor;
}

export interface INode<
  TPrototype extends INode | undefined = any,
  TArchetype extends INode | undefined = any
> {
  [$ARC]: TArchetype | undefined;
  [$PRO]: TPrototype | undefined;
  [$VARS]: ReadonlyMap<IKey, IEntry>;
}

abstract class ANode<
  TPrototype extends INode | undefined = any,
  TArchetype extends INode | undefined = any
> implements INode<
  TPrototype,
  TArchetype
> {
  #_entries?: Map<IKey, IEntry>;
  #entries?: Readonly<Map<IKey, IEntry>>;
  static get [$ARC](): INode | undefined { throw new Error('Not implemented; [$ARC] in INode is Abstract!'); }
  static get [$PRO](): INode | undefined { throw new Error('Not implemented; [$PRO] in INode is Abstract!'); }
  static get [$TYP](): Type {
    return this as any;
  }

  abstract get [$TYP](): Type<TPrototype, TArchetype>;

  static get [$KEY](): string {
    return this.name.toKebabCase();
  }

  get [$ARC](): TArchetype | undefined {
    return (this.constructor as any)[$ARC] as TArchetype;
  }

  get [$PRO](): TPrototype | undefined {
    return (this.constructor as any)[$PRO] as TPrototype;
  }


  get [$VARS](): ReadonlyMap<IKey, IEntry> {
    const vars = this[$_VARS];
    return this.#entries ??= this.#wrapEntries(vars);
  }

  protected get [$_VARS](): Map<IKey, IEntry> {
    return this.#_entries ??= new Map();
  }

  #wrapEntries(entries: Map<IKey, IEntry>): Readonly<Map<IKey, IEntry>> {
    return new Proxy(entries, {
      set: (_, prop, value) => {
        throw new TypeError(`Cannot assign value: ${value.toString()} to read only property '${prop.toString()}' on read-only collection of entries for Node of type #<${this[$TYP][$KEY]}>.`);
      },
      deleteProperty: (_, prop) => {
        throw new TypeError(`Cannot delete property '${prop.toString()}' on read-only map of entries for Node of type #<${this[$TYP][$KEY]}>.`);
      },
      get: (target, prop: keyof Map<IKey, IEntry>) => {
        if (prop === 'set') {
          return (key: IKey, value: IEntry) => {
            throw new TypeError(`Cannot assign value: ${value.toString()} at key '${key.toString()}' in read-only map of entries for Node of type #<${this[$TYP][$KEY]}>.`);
          }
        } else if (prop === 'delete') {
          return (key: IKey) => {
            throw new TypeError(`Cannot delete value at key '${key.toString()}' in read-only map of entries for Node of type #<${this[$TYP][$KEY]}>.`);
          }
        } else if (prop === 'clear') {
          return () => {
            throw new TypeError(`Cannot clear read-only map of entries for Node of type #<${this[$TYP][$KEY]}>.`);
          }
        } else {
          return target[prop];
        }
      }
    });
  }
}

class Node<
  TPrototype extends INode | undefined = undefined,
  TArchetype extends INode | undefined = undefined
> extends ANode<
  TPrototype,
  TArchetype
> {
  static readonly Type: NodeConstructor;
  get [$TYP]() {
    return this.constructor as typeof Node<TPrototype, TArchetype>;
  }
}

function NodeConstructor<
  TSelf extends Type<TPrototype, TArchetype>,
  TPrototype extends INode | undefined,
  TArchetype extends INode | undefined
>(
  pro?: TPrototype,
  arc?: TArchetype
) {
  abstract class TNode extends Node<TPrototype, TArchetype> {
    static get [$ARC](): TArchetype | undefined {
      return arc;
    }

    static get [$PRO](): TPrototype | undefined {
      return pro;
    }

    get [$TYP](): TSelf {
      return this.constructor as TSelf;
    }
  }

  return TNode;
}

type NodeConstructor =
  <
    TSelf extends Type<TPrototype, TArchetype>,
    TPrototype extends INode | undefined,
    TArchetype extends INode | undefined
  >(
    pro?: TPrototype,
    arc?: TArchetype
  ) => ReturnType<typeof NodeConstructor<TSelf, TPrototype, TArchetype>>;


(Node as (typeof Node & {
  Type: NodeConstructor;
})).Type = NodeConstructor as NodeConstructor;

export { Node };
export default Node;

export abstract class Primitive extends Node.Type() {
  constructor(
    public readonly value?: string | number | boolean
  ) { super(); }
}

export class Empty extends Primitive {
  constructor() { super() }
}

export class String extends Primitive {
  constructor(
    value: string
  ) { super(value) }
}

export class Number extends Primitive {
  constructor(
    value: number
  ) { super(value) }
}

export class Boolean extends Primitive {
  constructor(
    value: boolean
  ) { super(value) }
}

export class Statement extends Node.Type<Statement>() {

}

export class Expression extends Statement { }
export class Identifier extends Expression { }
export class Literal extends Expression { }
export class Invocation extends Expression { }


export interface IKey {
  get value(): string | number;
}

export class Key extends Identifier implements IKey {
  value: string | number;

  constructor(value: string | number) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value.toString();
  }
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

export interface IValue {
  get key(): IKey,
  get value(): INode,
  get parent(): INode,
}

export class Value extends Node.Type() implements IValue {
  constructor(
    public readonly parent: Struct,
    public readonly key: Key,
    public readonly value: Expression,
  ) { super() }
}

export interface IEntry {
  get key(): IKey,
  get value(): IValue,
  get parent(): INode,
}

export class Entry extends Node.Type() {
  constructor(
    public readonly parent: Struct,
    public readonly key: Key,
    public readonly value: Value,
  ) { super() }
}

export abstract class Struct extends Node.Type() { }