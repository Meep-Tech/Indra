import Matter from "../matter";
import { IFrontmatter } from "./interface";

export class Frontmatter extends Matter implements IFrontmatter {
  $serialize(): string {
    throw new Error("Method not implemented.");
  }
}

export default Frontmatter;