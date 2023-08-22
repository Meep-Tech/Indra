import { Data } from "../../datas/data/class";
import IBody from "./interface";
import { IOrderedDex, Key, Tag } from "../../../dex";
import { IContainer } from "../../../elements/container";
import { IElement } from "../../../elements/element";
import { IRoot } from "../../../elements/root/interface";
import { Mote } from "../../../files/motes";

/**
 * The body of a mote. Used to store a mote's views, components, and visible content.
 * 
 * - Aka the 'body' of the mote
 */
export abstract class Body extends Data implements IBody {

  constructor(
    readonly $mote: Mote
  ) {
    super($mote);
  }

  abstract get $root(): IRoot;

  abstract get $src(): string;

  //#region IElement

  abstract get $args(): Record<string, unknown>;

  abstract get $parent(): IContainer<IElement<Record<string, unknown>, Record<string, unknown>> | IElement<Record<string, unknown>, Record<string, unknown>>[] | undefined, any, any> | undefined;

  abstract get $props(): Record<string, unknown>;

  abstract get $tags(): ReadonlySet<string>;

  abstract get $content(): IElement<Record<string, unknown>, Record<string, unknown>> | IElement<Record<string, unknown>, Record<string, unknown>>[] | undefined;

  abstract get $children(): IOrderedDex<IElement<Record<string, unknown>, Record<string, unknown>>, Key, Tag> | undefined;

  abstract $render(): HTMLElement;

  abstract $preview(): HTMLElement;

  abstract $toCode(): HTMLElement;

  abstract $toString(): string;

  //#endregion
}


export default Body;