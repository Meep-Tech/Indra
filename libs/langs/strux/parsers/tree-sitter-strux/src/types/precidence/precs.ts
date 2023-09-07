

declare type Precs<
  TPrecs extends { [key: string]: number; }
> = {
    [key in Extract<keyof TPrecs, string>]: Prec<key, TPrecs[key]>;
  }
