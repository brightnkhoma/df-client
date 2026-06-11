import { Entity } from "./entity";


export interface User extends Entity{
    email : string;
    phoneNumber? : string;
    avatar ? : string;

}


export interface UserLocation{
    district : string;
    area : string;
}




export type PublicUser = Pick<User,"phoneNumber" | "email" | "name"  | "dateCreated" | "avatar">