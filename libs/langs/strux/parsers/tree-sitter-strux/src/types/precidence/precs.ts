import { Prec } from "./prec";

export const Precs = (function Precs<
  TPrecs extends { [key: string]: number; }
>(
  precs: TPrecs
) {
  const precidences = {} as {
    [key in Extract<keyof TPrecs, string>]: Prec<key, TPrecs[key]>;
  };

  for (const key in precs) {
    const precKey = key as Extract<keyof TPrecs, string>;
    const value = precs[key];
    precidences[precKey] = new Prec(key, value);
  }

  return Object.freeze(precidences);
}) as unknown as {
  new <
    TPrecs extends { [key: string]: number; }
  >(
    precs: TPrecs
  ): {
      [key in Extract<keyof TPrecs, string>]: Prec<key, TPrecs[key]>;
    };
};

export default Precs;
