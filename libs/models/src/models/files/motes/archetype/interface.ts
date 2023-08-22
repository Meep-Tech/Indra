import { IMote } from '../mote';

/**
 * The base for a Archetype.
 * Archetypes are like prototypes that allow for multiple inheritance.
 */
export interface IArchetype<
  TKey extends string = string,
> extends IMote {
  get $key(): TKey;
  get $isAbstract(): boolean;
};

export default IArchetype;