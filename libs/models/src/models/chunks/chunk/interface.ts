import { IStructure } from "../../structure";
import IFile from "../../file/interface";

/**
 * A unit of serializeable, structured data.
 */
export interface IChunk extends IStructure {
  readonly $file: IFile;

  /**
   * Serialize this chunk into a string for it's mote file.
   */
  $serialize(): string;
}

export default IChunk;