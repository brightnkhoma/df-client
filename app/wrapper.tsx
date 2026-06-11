"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./lib/context/context";
import { User } from "./lib/types/user";
import { Server } from "./lib/api/server";


const api = new Server();
export const Wrapper = ({children} : {children : ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)


    const refresh = async()=>{
        try {
            setIsAuthenticating(true);
            const _user = await api.auth.me()
            setUser(_user)
        } catch (error) {
            console.log(error);
            
            
        }finally{
            setIsAuthenticating(false)
        }

    }

    useEffect(()=>{
        refresh()
    },[])

    return(
        <AppContext.Provider value={{api,user,refresh}}>
            {children}
        </AppContext.Provider>
    )
}