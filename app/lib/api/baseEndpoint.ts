import { NextRequest } from "next/server";
import { BaseManager } from "./baseManager";
import { onDelete, onGet, onPost, onPut, onQuery } from "./api";

export class BaseEndPoint{
    main : BaseManager<any>;
    path : string;
    constructor(m : BaseManager<any>){
        this.main = m;
        this.path = this.main.path;
        this.post= this.post.bind(this);
        this.get = this.get.bind(this);
        this.delete = this.delete.bind(this);
        this.put = this.put.bind(this)
    }
    async post(req : NextRequest){
        const data = await req.json();
        const endPoint = `${this.path}`;
        return await onPost(endPoint,data,"item");
    }
    async put(req : NextRequest){
         const data = await req.json();
        const endPoint = `${this.path}`;
        return await onPut(endPoint,data,"success");
    }

    async get(req : NextRequest){
        const id = req.nextUrl.searchParams.get("id");
        const type = req.nextUrl.searchParams.get("type") as "one" | "query" | "search" | "pquery" | "querycount";
        const q = req.nextUrl.searchParams.get("q")
        const token = req.nextUrl.searchParams.get("token") as "1" | "2";
        switch(type){
            case "one": return await onGet(`${this.path}/${id}`,"item",token == "1");
            case "query": return await onQuery(`${this.path}/get/query`,{query : q},"items",token == "1")
            case "search":return await onGet(`${this.path}/search/${req.nextUrl.searchParams.get("text")}`,"items",token == "1")
            case "pquery": return await onQuery(`${this.path}/get/pquery`,{query : q},"items",token == "1")
            case "querycount": return await onQuery(`${this.path}/get/qcount`,{query : q},"item",token == "1")

        }
    }

    async delete(req : NextRequest){
        return await onDelete(`${this.path}/${req.nextUrl.searchParams.get("id")}`);

    }

    static init(m: BaseManager<any>){
        const base = new BaseEndPoint(m);
        return {POST : base.post.bind(this),GET : base.get.bind(this),PUT : base.put.bind(this), DELETE : base.delete.bind(this)}
    }
}