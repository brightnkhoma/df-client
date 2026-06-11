import { createContext } from "react";
import { User } from "../types/user";
import { Server } from "../api/server";

interface Props{
    user : User | null,
    api : Server,
    refresh: () => Promise<void>
}

const initialState : Props = {
    user: null,
    api: new Server,
    refresh: function (): Promise<void> {
        throw new Error("Function not implemented.");
    }
};

const AppContext = createContext(initialState);

export {AppContext}