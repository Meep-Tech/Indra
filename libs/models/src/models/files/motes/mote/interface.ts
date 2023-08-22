import { IBody, IFrontmatter, IRearmatter } from "../../../chunks";
import { Tag } from "../../../dex";
import { IFile } from "../../file";
import { References } from "./refs";

// TODO: motes are stored in instances usually in the runtime, and instances can have the flags:
// instances of motes can also be imutable or mutable themselves as a proxy-like-mask
// 'source' is considered a source of truth / home / origin for the mote, 'clone' is just a copy that is then un-linked, 'shadow' starts as a mirror, but only values will remain changed, 'mirror' is just a ref to the original that's not considered a source.
export interface IMote extends IFile {

  /**
   * Universal ID for the mote.
   */
  get $id(): string;

  /**
   * Locally unique ID for the mote.
   * Usually human readable.
   */
  get $key(): string;

  /**
   * The mote's tags
   */
  get $tags(): ReadonlySet<Tag>;

  /**
   * Potentially Non-unique aliases for the mote.
   */
  get $aliases(): ReadonlySet<string>;

  /**
   * The mote's identifiable names, including it's key and id.
   */
  get $names(): ReadonlySet<string>;

  /**
   * Instances that reference this mote.
   */
  get $refs(): References;

  //#region Chunks

  /**
   * YAML-Like data storage for vars and functions within a mote. (above the body)
   */
  get $head(): IFrontmatter;

  /**
   * The body of the mote, used to render the mote visually.
   */
  get $body(): IBody;

  /**
   * YAML-Like data storage for vars and functions within a mote. (below the body)
   */
  get $tail(): IRearmatter;

  //#endregion
}

export default IMote;