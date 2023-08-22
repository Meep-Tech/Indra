import Matter from "../matter";
import { IRearmatter } from "./interface";

export class Rearmatter extends Matter implements IRearmatter {
  $serialize(): string {
    throw new Error("Method not implemented.");
  }
}

export default Rearmatter;