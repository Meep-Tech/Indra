import { lazy } from '../../../../utils/decorators/lazy';
import Tag from '../../../../utils/types/tag';
import {
  Frontmatter,
  Body,
  Rearmatter
} from '../../../chunks';
import { IMote } from './interface'
import { References } from "./refs";
import { File } from '../../file';

export abstract class Mote extends File implements IMote {
  #id: string = null!;
  #key: string = null!;
  #names?: Set<string>;

  get $id() {
    return this.#id ?? crypto.randomUUID();
  }

  set $id(value: string) {
    this.#id = value;
    this.#names = undefined;
  }

  get $key(): string {
    return this.#key;
  }

  set $key(value: string) {
    this.#key = value;
  }

  abstract get $tags(): Set<Tag>;
  abstract get $aliases(): Set<string>;

  get $names(): ReadonlySet<string> {
    return this.#names
      ??= new Set([this.$key, ...this.$aliases]);
  }

  get $refs(): References {
    return new References(this);
  }

  @lazy
  get $head(): Frontmatter {
    return new Frontmatter(this);
  }

  abstract get $body(): Body;

  @lazy
  get $tail(): Rearmatter {
    return new Rearmatter(this);
  }

  @lazy
  get $chunks() {
    return Object.freeze({
      head: this.$head,
      body: this.$body,
      tail: this.$tail
    })
  }
}

export default Mote;