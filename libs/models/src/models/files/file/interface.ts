import { IChunk } from "../../chunks";
import FileLoader from "./loader";

export interface IFile {
  get $path(): string | undefined;
  get $chunks(): Readonly<{ [key: string]: IChunk }>;
  get $loader(): FileLoader<this>;
}

export default IFile;