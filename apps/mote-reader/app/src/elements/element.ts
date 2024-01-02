import { IsEmpty, OrNone } from "../utils/types";

const NONE = Symbol("NONE");

export type INode
  = RenderNode<any>;

export type RenderNode<TNode extends Node | undefined = HTMLElement | undefined>
  = ElementConstructor<any, TNode>
  | Element<any, TNode>
  | Iterable<RenderNode<TNode>>
  | HTMLElement
  | Node
  | boolean
  | string
  | number
  | null
  | undefined;

export interface IElementConstructor extends ElementConstructor<any> { }

export type IProps = {
  [key: string | number | symbol]: any;
};

export interface ElementConstructor<
  TProps extends IProps = {},
  TNode extends INode = HTMLDivElement | undefined
> extends Function {
  new(...args: any[]): Element<TProps, TNode>;
}

export interface IElement extends Element<any> { }

export abstract class Element<
  TProps extends IProps = {},
  TNode extends INode = HTMLDivElement | undefined,
> {
  readonly #props: TProps | undefined;
  #html: TNode | typeof NONE = NONE;

  get html(): TNode {
    if (this.#html === undefined) {
      let rendered = this.render();
      if (this.#html === undefined) {
        this.#html = null;
      }
    }

    return this.#html === NONE ? undefined : this.#html;
  }

  public get props(): TProps {
    return this.#props ?? ({} as IsEmpty<TProps> extends true ? TProps : never);
  }

  constructor(props: OrNone<TProps>) {
    this.#props = props;
  }

  public render(): TNode {
    return this.html;
  }
}

export namespace Element {
  export type Props = IProps;
}

export default Element;