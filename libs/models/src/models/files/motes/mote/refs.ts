import Mote from "./class";

/**
 * References to a mote from runtime instances and other motes.
 */
export class References {
  get $in() {
    throw new Error("Method not implemented.");
  }

  get $out() {
    throw new Error("Method not implemented.");
  }

  get $sources() {
    throw new Error("Method not implemented.");
  }

  get $clones() {
    throw new Error("Method not implemented.");
  }

  get $shadows() {
    throw new Error("Method not implemented.");
  }

  get $mirrors() {
    throw new Error("Method not implemented.");
  }

  constructor(
    readonly $mote: Mote,
  ) {
  }
}
