import { Entity } from "./entity";


export interface DbRecord extends Entity{
    dbId : string;
    fields:  Record<string,FieldType>;

}

export interface FieldType{
    type : FieldDataType ,
    value : string | number | boolean | "yes" | "no" | null | Coords

}

export type FieldDataType = "string" | "number" | "boolean" | "yes" | "no" | "null" | "Coordinates"

export interface Coords{
    lat : number;
    long :number;
    accuracy ?:number
}