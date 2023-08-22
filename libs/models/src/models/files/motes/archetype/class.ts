import { Mote } from "../mote";
import IArchetype from "./interface";

namespace Archetype {
  export type Any = Archetype<any>;
  export type AnyType = typeof Archetype<any>;
}

abstract class Archetype<TKey extends string = string> extends Mote implements IArchetype<TKey> {
  public abstract get $key(): TKey;
  public abstract get $isAbstract(): boolean;

  constructor(
    path: string,
  ) {
    super(path);
  }
}

export { Archetype }
export default Archetype;