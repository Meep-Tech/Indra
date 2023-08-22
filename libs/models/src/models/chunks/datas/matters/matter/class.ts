import { Mote } from "../../../../files/motes";
import { Data } from "../../data/class";
import { IMatter } from "./interface";

export abstract class Matter extends Data implements IMatter {
  constructor(
    readonly $mote: Mote
  ) {
    super($mote);
  }
}

export default Matter;