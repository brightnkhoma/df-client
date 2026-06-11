import { Coords } from "@base-ui/react";
import { FieldDataType } from "./farmer";

export interface Cell{
    colNumber : number;
    value : string | number | null | Coords | boolean | "yes" | "no" | Coords ;
    type : FieldDataType;
    rowId : string;
    id : string;

}