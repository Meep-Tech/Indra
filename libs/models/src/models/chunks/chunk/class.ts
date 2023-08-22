import IChunk from './interface';
import { Structure } from '../../structure';
import { IFile } from '../../files/file';

export abstract class Chunk extends Structure implements IChunk {

  constructor(
    readonly $file: IFile
  ) {
    super();
  }

  abstract $serialize(): string;
}

export default Chunk;