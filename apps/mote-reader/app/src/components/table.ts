import { INode } from "../nodes/node";

export type ZeroTo100
  = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40
  | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50
  | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60
  | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70
  | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80
  | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90
  | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100;

export type RenderNode
  // TODO: limit this to component ctors that take either no args, or a prop and state args.
  = typeof Component
  | IComponent
  | HTMLElement
  | Node
  | INode
  | undefined
  | null
  | boolean
  | string
  | number
  | Renderer
  | Iterable<RenderNode>;

export type Renderer = (($: IComponent) => RenderNode);

export interface IState extends State<any, any> { }
export type State<TKeys extends PropertyKey = PropertyKey, TValues = unknown> = {
  [key in TKeys]: TValues;
}

export interface IProps extends Props<any, any> { }
export type Props<TKeys extends PropertyKey = PropertyKey, TValues = unknown> = {
  [key in TKeys]: TValues;
}

export interface IUpdater extends Updater<any, any> { }
export type Updater<TProps extends IProps = Props, TState extends IState = State>
  = (newProps: TProps, $: Component<TProps, TState>) => TProps | { $state: Partial<TState>, $props: Partial<TProps>, $refresh: boolean | Renderer | Node | Component | typeof Component };

export interface IInit extends Init<any, any> { }
export type Init<TProps extends IProps, TState extends IState>
  = Updater<TProps, TState> | (TState & TProps);

export interface IConfig extends Config<any, any> { }
export type Config<TProps extends IProps, TState extends IState> = {
  onUpdate?: Updater<TProps, TState>;
  stateDepth?: ZeroTo100;
};

export interface IComponent extends Component<any, any> { }
export abstract class Component<
  TProps extends IProps = Props,
  TState extends IState = State
> {
  private readonly _config: {
    stateDepth?: ZeroTo100,
    onUpdate?: Updater<TProps, TState>
  };

  public static readonly DEFAULT_CONFIG: typeof Component.prototype._config = {
    stateDepth: 3
  };

  private _props: TProps;
  private _state: TProps & TState;
  private _container?: HTMLElement;
  private _element?: globalThis.Node | null;
  private _dirty?: boolean;

  public static get Breakpoint(): Breakpoint {
    return window.innerWidth > 1200
      ? 'xl'
      : window.innerWidth > 992
        ? 'lg'
        : window.innerWidth > 768
          ? 'md'
          : window.innerWidth > 576
            ? 'sm'
            : 'xs'
  }

  public get props(): TProps {
    return this._props;
  }

  get state(): TProps & TState {
    return this._state;
  }

  get element(): globalThis.Node | undefined {
    if (this._element === undefined) {
      this._element = Component.#Render(this);
      if (this._element === undefined) {
        this._element = null;
      }
    }

    return this._element ?? undefined;
  }

  get container(): HTMLElement | undefined {
    return this._container;
  }

  constructor(
    props: TProps,
    state?: TState,
    config?: Config<TProps, TState>
  ) {
    this._props = props;
    this._config = config ?? Component.DEFAULT_CONFIG;
    this._state = Component.#WrapState(
      this, // todo: bind this?
      state ?? ({} as TState & TProps)
    );
  }

  abstract render(): RenderNode;

  attach(container: HTMLElement): this {
    this.detach();
    this._container = container;

    if (this.element) {
      this._container.appendChild(this.element);
    }

    return this;
  }

  detach(): this {
    if (this.element) {
      this._container?.removeChild(this.element);
    }

    this._container = undefined;

    return this;
  }

  refresh(): this {
    let renderd = this.render();
    if (renderd) {
      if (!this._element) {
        this._container?.appendChild(this.element as Node);
      } else {
        this._container?.replaceChild(
          this.element as Node,
          this.element as Node
        );
      }
    } else {
      this._element = null;
    }

    return this;
  }

  update(newProps: TProps | ((current: TProps) => TProps)): this {
    if (typeof newProps === 'function') {
      newProps = (newProps as (current: TProps) => TProps)(this.props);
    }

    if (this._config.onUpdate) {
      let result
        = this._config.onUpdate(newProps, this);

      if (result instanceof Object) {
        if (result.hasOwnProperty('$state')) {
          this._dirty = false;
          for (const key in Object.keys(result.$state)) {
            (this._state as any)[key] = result.$state[key];
          }

          if (this._dirty) {
            this.refresh();
          } else {
            this._dirty = undefined;
          }
        }

        if (result.hasOwnProperty('$props')) {
          this._props = result.$props;
        }

        if (this._dirty) {
          this._dirty = undefined;
        } else if (result.hasOwnProperty('$refresh')) {
          if (result.$refresh === true) {
            this.refresh();
          } else if (result.$refresh !== false) {
            this._element = Component.#Wrap(this, result.$refresh);
          } else {
            throw new Error('Invalid refresh value returned during component update from onUpdate handler.');
          }
        } else {
          this.refresh();
        }
      } else {
        this._props = result;
        this.refresh();
      }
    } else {
      this._props = newProps;
      this.refresh();
    }

    return this;
  }

  static #Render(
    component: IComponent
  ): globalThis.Node | undefined {
    let rendered = component.render();
    component._element = Component.#Wrap(component, rendered);

    return component._element;
  }

  static #Wrap(
    source: IComponent,
    render: RenderNode,
  ): globalThis.Node | undefined {
    if (render === undefined || render === null) {
      return undefined;
    } else if (typeof render === 'object') {
      if (render instanceof Node) {
        return render;
      } else if (render instanceof Array) {
        let el = document.createDocumentFragment();
        render.forEach(child => {
          el.appendChild(Component.#Render(child) as Node);
        });
      } else if (render instanceof Component) {
        return Component.#Render(render);
      } else if (render.hasOwnProperty(Symbol.iterator)) {
        document.createDocumentFragment();
        for (const child of (render as Iterable<RenderNode>)) {
          source._element?.appendChild(Component.#Wrap(source, child) as Node);
        }
      }
    } else if (typeof render === 'function') {
      if (render.prototype instanceof Component) {
        const ctor = render as typeof Component as unknown as new (
          props: IProps,
          state: IState
        ) => IComponent;

        return source._element = Component.#Render(new ctor(
          source.props,
          source.state
        ));
      } else {
        render = (render as Renderer)(source);
      }
    } else {
      return source._element = document.createTextNode(render.toString());
    }
  }

  static #WrapState<T extends object>(
    component: IComponent,
    state: T,
    prop?: keyof T,
    depth: number = 3
  ): T {
    let target: unknown = state;
    if (prop) {
      target = state[prop];
    }

    if (target !== null && target !== undefined) {
      // state is used to take control of the value of an object/value; so we need to unwrap any existing control proxies.
      while ((target as any)?.hasOwnProperty('__unwrap_controlled_state_value__')) {
        target = (target as any).__unwrap_controlled_state_value__;
      }

      if (typeof target === 'object' && target !== null) {
        if (depth != 0) {
          for (const key in Object.keys(target)) {
            (target as any)[key] = Component.#WrapState<typeof target>(
              component,
              target,
              key as any,
              depth - 1
            );
          }
        }
      }
    }

    return new Proxy<{ target: any }>({ target }, {
      set(target, prop, value) {
        let current = target.target[prop];
        if (current !== value) {
          target.target[prop] = Component.#WrapState(component, target, prop as any, depth - 1);
          if (component._dirty === undefined) {
            component.refresh();
          } else {
            component._dirty = true;
          }
        }

        return true;
      },
      get(target, prop) {
        if (prop == '__unwrap_controlled_state_value__') {
          return (curr: any) => curr === target.target;
        } else {
          return target.target[prop];
        }
      }
    }) as unknown as T;
  }
}

export class Table<TCols extends Cols> extends Component<{ cols: TCols }, { data: Rows<TCols> }> {
  constructor(
    cols: TCols,
    data: Rows<TCols>
  ) { super({ cols }, { data }) }

  render(): RenderNode {
    let table = document.createElement('table');
    let head = document.createElement('thead');
    let body = document.createElement('tbody');

    let headRow = document.createElement('tr');
    this.props.cols.forEach(col => {
      let cell = document.createElement('th');
      cell.innerText = col.name ?? col.key;
      headRow.appendChild(cell);
    });

    head.appendChild(headRow);
    table.appendChild(head);

    for (const rowData of this.state.data) {
      let rowItems = this.props.cols.map(col => {
        let item = rowData[col.key];
        if (col.value) {
          if (col.value instanceof Function) {
            item = col.value(item);
          } else {
            item = col.value[Component.Breakpoint](item);
          }
        }

        return item;
      });

      let row = new Row(rowItems);
      body.appendChild(row.element!);
    }

    table.appendChild(body);

    return table;
  }
}

export type RowItem
  = Cell
  | Field
  | Head
  | None
  | undefined;

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ByBreakpoint<T> = { [minSize in Breakpoint]: T }
export type Cols<T extends [...any[]] = [...unknown[]]> = {
  [index in keyof T]: Col<T[index]>
} & {
  length: T['length'],
  [Symbol.iterator](): Iterator<Col<T[number]>>
}

export type Col<T = unknown> = {
  key: string,
  name?: string,
  weight?: ZeroTo100,
  width?: `${number}%`
  | ByBreakpoint<`${number}%`>,
  value?: ((val: T) => RowItem)
  | ByBreakpoint<(val: T) => RowItem>
}

export type Rows<TCols extends Cols<any>> = {
  [key in TCols[number]['key']]: (TCols[number]['value'] extends ((val: any) => RowItem)
    ? Parameters<TCols[number]['value']>[0]
    : (TCols[number]['value'] extends ByBreakpoint<(val: any) => RowItem>
      ? (TCols[number]['value'][Breakpoint] extends ((val: any) => RowItem)
        ? Parameters<TCols[number]['value'][Breakpoint]>[0]
        : never)
      : never))
} & {
  length: TCols['length'],
  [Symbol.iterator](): Iterator<TCols[number]['value'] extends ((val: any) => RowItem)
    ? Parameters<TCols[number]['value']>[0]
    : (TCols[number]['value'] extends ByBreakpoint<(val: any) => RowItem>
      ? (TCols[number]['value'][Breakpoint] extends ((val: any) => RowItem)
        ? Parameters<TCols[number]['value'][Breakpoint]>[0]
        : never)
      : never)>
}

class Row extends Component {
  constructor(items: RowItem[]) {
    super({
      items
    })
  }

  render(): RenderNode {
    return "";
  }
}

class Cell extends Component {
  constructor(content: RenderNode, protected exProps: Props) {
    super({ content, ...exProps })
  }

  render(): RenderNode {
    return "";
  }
}

class Field extends Component {
  constructor(content: RenderNode) {
    super({ content })
  }

  render(): RenderNode {
    return "";
  }
}

class Head extends Cell {
  constructor(key: string, content: RenderNode) {
    super(content, { key })
  }

  render(): RenderNode {
    return "";
  }
}

class None extends Component {
  constructor(content: RenderNode) {
    super({ content })
  }

  render(): RenderNode {
    return "";
  }
}