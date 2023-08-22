import { IFile } from "./interface";

export type FileLoader<TFile extends IFile = IFile>
  = (path: string) => Promise<TFile>;

export default FileLoader;