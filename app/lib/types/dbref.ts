import { Entity } from "./entity";
import { Row } from "./row";

export interface DbRef extends Entity{
    description ? :string,
    header : Row
}