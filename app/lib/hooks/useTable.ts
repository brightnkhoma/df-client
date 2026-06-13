import { useContext } from "react"
import { TableContext } from "../context/tableContext"


export const useTable = ()=>{
    const data = useContext(TableContext);
    return data;
}