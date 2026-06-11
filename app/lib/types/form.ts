import { Entity } from "./entity";

export interface DBForm extends Entity{
    title : string;
    descriptions : Description[];
    dbId :string;

}


export interface Description{
    title : string;
    images : string[];
    content : string
}