import { Cell } from "./cell";
import { Entity } from "./entity";

export interface Row extends Entity{
    cells : Record<string,Cell>;
}