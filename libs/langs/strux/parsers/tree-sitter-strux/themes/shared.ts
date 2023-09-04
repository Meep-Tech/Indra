export type ANSIColorName
  = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'
export type HexColor
  = `#${number | string}${number | string}${number | string}${number | string}${number | string}${number | string}`
export type ANSIColorId
  = Uint8ClampedArray & number;

export type Color
  = ANSIColorName | HexColor | ANSIColorId;

export type StyleData = {
  color: Color;
  underline?: boolean;
  italic?: boolean;
  bold?: boolean;
};

export type ThemeBuilder<TColors extends string>
  = ($: { [key in TColors]: StyleBuilder }) => { [key: string]: Style };

export type ParentStyle = {
  /** 
   * The parent style
   */
  _: BasicStyle;

  /**
   * The child styles
   */
  [key: string]: Style;
};

export class StyleBuilder implements StyleData {
  readonly #style: StyleData;
  #bold: (boolean & { (set: boolean): StyleBuilder; } & { toggle(): StyleBuilder; } & StyleBuilder)
  #italic: (boolean & { (set: boolean): StyleBuilder } & { toggle(): StyleBuilder } & StyleBuilder)
  #underline: (boolean & { (set: boolean): StyleBuilder } & { toggle(): StyleBuilder } & StyleBuilder)
  #lighter: StyleBuilder & { (levels: number): StyleBuilder; }
  #darker: StyleBuilder & { (levels: number): StyleBuilder; }

  readonly color: (Color & { (set: Color): StyleBuilder })
    = Object.assign(
      (set: Color) => {
        return new StyleBuilder({
          ...this.#style,
          color: set
        });
      },
      {
        valueOf: () => this.#style.color,
        constructor: String,
        toString: () => this.#style.color,
        [Symbol.toPrimitive]: () => this.#style.color,
        [Symbol.toStringTag]: 'String',
      } as unknown as Color
    );

  get underline(): (
    boolean
    & { (set: boolean): StyleBuilder }
    & { toggle(): StyleBuilder }
    & StyleBuilder
  ) {
    return this.#underline ??= Object.assign(
      (set: boolean) => {
        return new StyleBuilder({
          ...this.#style,
          underline: set
        });
      },
      {
        ...this,
        toggle: () => {
          return new StyleBuilder({
            ...this.#style,
            underline: !this.#style.underline
          });
        },
        valueOf: () => this.#style.underline ?? false,
        constructor: Boolean,
        toString: () => this.#style.underline ?? false,
        [Symbol.toPrimitive]: () => this.#style.underline ?? false,
        [Symbol.toStringTag]: 'Boolean',
      } as unknown as (boolean & StyleBuilder & { toggle(): StyleBuilder }));
  }

  get italic(): (
    boolean
    & { (set: boolean): StyleBuilder }
    & { toggle(): StyleBuilder }
    & StyleBuilder
  ) {
    return this.#italic ??= Object.assign(
      (set: boolean) => {
        return new StyleBuilder({
          ...this.#style,
          italic: set
        });
      },
      {
        ...this,
        toggle: () => {
          return new StyleBuilder({
            ...this.#style,
            italic: !this.#style.italic
          });
        },
        valueOf: () => this.#style.italic ?? false,
        constructor: Boolean,
        toString: () => this.#style.italic ?? false,
        [Symbol.toPrimitive]: () => this.#style.italic ?? false,
        [Symbol.toStringTag]: 'Boolean',
      } as unknown as (boolean & StyleBuilder & { toggle(): StyleBuilder }));
  }

  get bold(): (
    boolean
    & { (set: boolean): StyleBuilder; }
    & { toggle(): StyleBuilder; }
    & StyleBuilder
  ) {
    return this.#bold ??= Object.assign(
      (set: boolean) => {
        return new StyleBuilder({
          ...this.#style,
          bold: set
        });
      },
      {
        ...(new StyleBuilder({
          ...this.#style,
          bold: true
        })),
        toggle: () => {
          return new StyleBuilder({
            ...this.#style,
            bold: !this.#style.bold
          });
        },
        valueOf: () => this.#style.bold ?? false,
        constructor: Boolean,
        toString: () => this.#style.bold ?? false,
        [Symbol.toPrimitive]: () => this.#style.bold ?? false,
        [Symbol.toStringTag]: 'Boolean',
      } as unknown as (boolean & StyleBuilder & { toggle(): StyleBuilder; }));;
  }

  constructor(
    base: Style
  ) {
    if (typeof base === 'string') {
      this.#style = {
        color: base
      }
    }
  }

  get lighter(): StyleBuilder & { (levels: number): StyleBuilder; } {
    return this.#lighter ??= Object.assign(
      (levels: number) => {
        return new StyleBuilder({
          ...this.#style,
          color: StyleBuilder.#changeShadeOfColor(this.#style.color, levels)
        });
      },
      new StyleBuilder({
        ...this.#style,
        color: StyleBuilder.#changeShadeOfColor(this.#style.color, 1)
      })
    );
  }

  get darker(): StyleBuilder & { (levels: number): StyleBuilder; } {
    return this.#darker ??= Object.assign(
      (levels: number) => {
        return new StyleBuilder({
          ...this.#style,
          color: StyleBuilder.#changeShadeOfColor(this.#style.color, -levels)
        });
      },
      new StyleBuilder({
        ...this.#style,
        color: StyleBuilder.#changeShadeOfColor(this.#style.color, -1)
      })
    );
  }

  static #changeShadeOfColor(color: Color, levels: number): HexColor {
    color = color.valueOf() as Color;
    let hex: HexColor;

    if (color.length !== 7) {
      if (typeof color === 'number') {
        throw new Error(`Lightening of ANSIColorId colors is NOT YET SUPPORTED: ${color}`);
      } else {
        hex = StyleBuilder.#getColorHexByANSIName(color as ANSIColorName);
      }
    } else {
      hex = color as HexColor;
    }

    if (!hex.startsWith('#')) {
      throw new Error(`Invalid color: ${color}. (${hex})`);
    }

    return StyleBuilder.#changeShadeOfHexColor(hex, levels);
  }

  static #changeShadeOfHexColor(hex: HexColor, levels: number): HexColor {
    const color
      = hex.replace(`#`, ``);

    if (color.length === 6) {
      const decimalColor
        = parseInt(color, 16);

      let r = (decimalColor >> 16) + levels;
      r > 255 && (r = 255);
      r < 0 && (r = 0);

      let g = (decimalColor & 0x0000ff) + levels;
      g > 255 && (g = 255);
      g < 0 && (g = 0);

      let b = ((decimalColor >> 8) & 0x00ff) + levels;
      b > 255 && (b = 255);
      b < 0 && (b = 0);

      return `#${(g | (b << 8) | (r << 16)).toString(16)}` as HexColor;
    } else {
      return `#${color}` as HexColor;
    }
  }

  static #getColorHexByANSIName(name: ANSIColorName): HexColor {
    switch (name) {
      case 'black':
        return '#000000';
      case 'red':
        return '#ff0000';
      case 'green':
        return '#00ff00';
      case 'yellow':
        return '#ffff00';
      case 'blue':
        return '#0000ff';
      case 'magenta':
        return '#ff00ff';
      case 'cyan':
        return '#00ffff';
      case 'white':
        return '#ffffff';
      default:
        throw new Error(`Unknown ANSI color name: ${name}`);
    }
  }
}

export type BasicStyle = Color | StyleData;

export type Style = BasicStyle | ParentStyle;

export class Theme<
  TColors extends { [key: string]: Color }
> {
  constructor(
    public readonly colors: TColors,
    public readonly theme: ThemeBuilder<keyof TColors extends string ? keyof TColors : never>
  ) { }
}

const Base = new Theme({
  blue: "#0000ff",
  aqua: "#00ffff",
  green: "#008000",
  gray: "#808080",
  orange: "#ffa500",
  yellow: "#ffff00",
  brown: "#a52a2a",
  default: "#ffffff",
  purple: "#800080",
  pink: "#ffc0cb",
  lime: "#00ff00",
  red: "#ff0000",
}, $ => ({
  key: {
    _: $.blue,
    constant: $.gray.bold,
    procedural: {
      _: $.orange,
      archetype: $.green,
    },
    tag: $.yellow,
    seperator: {
      _: $.blue.darker(2),
      local: $.blue.darker(3),
      file: $.green.lighter(2),
    },
    prefix: {
      _: $.blue.lighter(2),
    },
  },
  literal: {
    _: $.default.bold,
    string: {
      _: $.brown,
      escape: $.brown.lighter(1).bold,
    },
    number: {
      _: $.aqua,
      decimal: $.aqua.lighter(1),
    },
    boolean: $.aqua.darker(3).bold
  },
  operator: {
    _: $.purple,
    assignment: $.purple.lighter(2),
    modifier: $.pink.lighter(3),
    math: $.purple.darker(5),
    execution: $.red,
  },
  delimiter: {
    _: $.default,
    lambda: $.purple.darker(2),
    map: $.blue.darker(3),
    array: $.pink,
  },
  comment: $.lime
}));


export default {
  colors: {
    blue: "0000ff",
    green: "008000"
  },
  theme: {
    identifier: {
      raw: {
        string: "blue--",
        number: {
          _: "blue--2",
          decimal: "blue--3"
        },
        boolean: "blue--4"
      },
      _: "blue++",
      struct: {
        _: "blue++",
        array: "blue++4",
        map: "blue++3",
        lambda: "blue++2"
      },
    }
  }
}