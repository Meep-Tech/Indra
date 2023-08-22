import { IChunk } from "../../chunks";
import { FileLoader } from "./loader";
import { IFile } from "./interface";

export abstract class File implements IFile {
  #isLoaded: boolean = false;

  get $isLoaded(): boolean {
    return this.#isLoaded;
  }

  abstract get $path(): string | undefined;
  set #path(value: string | undefined) {
    this.#path = value;
  }

  abstract get $chunks()
    : Readonly<{ [key: string]: IChunk; }>;

  abstract get $loader()
    : FileLoader<this>;

  constructor(
    path?: string
  ) {
    this.#path = path;
  }

  static async load(path: string): Promise<File> {
    return new (
      this as unknown as (
        File & {
          new(
            ...args: ConstructorParameters<typeof File>
          ): File
        }
      )
    )().$load(path);
  }

  async $load(path?: string): Promise<this> {
    this.#path = path ?? this.$path;
    if (!this.$path) {
      throw new Error(`Cannot load a File without a valid $path set.`);
    }

    return this.$loader(this.$path);
  }
}


export default File;