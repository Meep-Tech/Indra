import { IElement } from "../../../elements/element";
import { IRoot } from "../../../elements/root";
import { IMote } from "../../../files/motes";
import { IChunk } from "../../chunk";

/**
 * The body of a mote. Used to store a mote's views, components, and visible content.
 * 
 * - Aka the 'body' of the mote
 */
export interface IBody extends IChunk, IElement {
  get $mote(): IMote;

  get $root(): IRoot;

  get $src(): string;
}

export default IBody;