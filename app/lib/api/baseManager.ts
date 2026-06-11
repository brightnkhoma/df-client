import axios, { AxiosResponse } from "axios";
import { Entity } from "../types/entity";
import { showToast } from "../toast/toast";
import { PaginatedQuery, RouterQuery } from "../types/routerQuery";

export abstract class  BaseManager <T extends Entity>{
    path : string
    constructor(path : string) {
        this.path = path;
    }

    resReturn( res: AxiosResponse<any, any, {}>){
        if(!res.data.success){
            showToast("info",{description : res.data.message})
        }
        return res.data.success as boolean;
    }

    async create(v : T){
        const res = await axios.post(`/api/${this.path}`,{v});
        if(this.resReturn(res)){
            return res.data.item as string;
        }
        return null;
    }

    async update(id : string, updates : Partial<T>){
        const res = await axios.put(`/api/${this.path}`,{id,updates});
        return this.resReturn(res);
    }

    async get(id : string,token :boolean = true){
        const res = await axios.get(`/api/${this.path}`,{params : {id,type : "one",token : token ? "1" : "2"}});
        if(this.resReturn(res)){
            return res.data.item as T;
        }
        return null;
    }

    async query(q : RouterQuery<T>,token :boolean = false){

        
        const res = await axios.get(`/api/${this.path}`,{params : {q : JSON.stringify(q),type : "query",token : token ? "1" : "2"}});
        if(this.resReturn(res)){
            return res.data.items as T[];
        }
        return []
    }
    async queryCount(q : RouterQuery<T>,token :boolean = false){

        
        const res = await axios.get(`/api/${this.path}`,{params : {q : JSON.stringify(q),type : "querycount",token : token ? "1" : "2"}});
        if(this.resReturn(res)){
            return res.data.item as number;
        }
        return 0
    }
    async paginatedQuery(q : PaginatedQuery<T>,token :boolean = false){

        
        const res = await axios.get(`/api/${this.path}`,{params : {q : JSON.stringify(q),type : "pquery",token : token ? "1" : "2"}});
        if(this.resReturn(res)){
            return res.data.items as T[];
        }
        return []
    }
    async search(text : string,token :boolean = false){
        const res = await axios.get(`/api/${this.path}`,{params : {text,type : "search",token : token ? "1" : "2"}});
        if(this.resReturn(res)){
            return res.data.items as T[];
        }
        return []
    }

    async delete(id : string){
        const res = await axios.delete(`/api/${this.path}`,{params : {id}});
        return this.resReturn(res);
    }

}