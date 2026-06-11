import React, { SetStateAction } from "react";
import { Entity } from "../types/entity";
import { RouterQuery } from "../types/routerQuery";
import { collection, getCountFromServer, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./config/firebase";


export class Fbase{

    listenToCollection <T extends Entity>(path : string,q : RouterQuery<T>,setState : React.Dispatch<SetStateAction<T[]>>){
        const coll = collection(db,`${path}`);
        let qr = query(coll);
        const queries = [];
        for(const i of q.queries){
            queries.push(where(i.key as string,i.operator,i.value))
        }
        if(queries.length > 1){
            qr = query(qr,...queries)
        }

       const unSubscribe = onSnapshot(qr,(changes)=>{
            changes.docChanges().forEach(change=>{
                const  {doc,type} = change;
                const item = doc.data() as T
                switch(type){
                    case "added": setState(x=>{
                        if(x.some(i=> i.id == item.id)){
                            return x
                        }
                        return [...x,item]
                    }) ;break;
                    case "removed": setState(x=>{
                        return x.filter(i=> i.id !== item.id);
                    });break;
                    case "modified": setState(x=>x.map(i=> i.id == item.id ? item : i));
                }
            })
        })
        return unSubscribe;


    }


    async count<T extends Entity>(path : string,q : RouterQuery<T>){
        const col = collection(db,path);
        const queries = [];
        for(const i of q.queries){
            queries.push(where(i.key as string,i.operator,i.value));
        }
        const _query = query(col,...queries);
        const _count = await getCountFromServer(_query);
        return _count.data().count

    }
}