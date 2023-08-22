import { IMote } from "../../../../files/motes";
import { IData } from "../../data/interface";

export interface IMatter extends IData {
  get $mote(): IMote;
}