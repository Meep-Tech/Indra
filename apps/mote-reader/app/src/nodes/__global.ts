import { $, Node, String, Number, Boolean, Empty, INode } from "./node";

declare global {
  // interface Object {
  //   [$]: Node;
  // }

  interface String {
    toKebabCase(): string;
  }
}

Object.defineProperty(globalThis.String.prototype, 'toKebabCase', {
  value: function toKebabCase(this: string) {
    return this.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($, ofs) => (ofs ? "-" : "")
        + $.toLowerCase()
    );
  }
});

Object.defineProperty(Object.prototype, $, {
  get: function objectAsNode(this: INode | string | number | boolean): INode {
    if (this instanceof Node) {
      return this;
    } else {
      if (typeof this === 'string') {
        return new String(this);
      } else if (typeof this === 'number') {
        return new Number(this);
      } else if (typeof this === 'boolean') {
        return new Boolean(this);
      } else if (this === null || this === undefined) {
        return new Empty();
      }
    }

    throw new Error(`Cannot convert type: ${(this as any).constructor.name}, to a Node.`);
  }
});
