import { Entity } from "../types/entity";
import { AppAuth } from "./auth";
import { BaseManager } from "./baseManager";
import { Fbase } from "./Ffirebase";

export class Server {
    auth : AppAuth;
    private  base : Fbase | null = null;
    constructor(){
        this.auth = new AppAuth();
    }

    getDb<T extends Entity>(path : string){
        class Class extends BaseManager<T>{
            constructor(){
                super(path)
            }

        }
        return new Class();
    }

    getBase(){
        if(!this.base){
            this.base = new Fbase()
        };
        return this.base;
    }
  
    async getSignature(){
        const res = await fetch("/api/cloud");
        const data = await res.json();
        if(data.success){
            return data.signature as string;
        }
        return null;
    }
    
}