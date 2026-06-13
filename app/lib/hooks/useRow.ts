import { useContext } from "react"
import { RowContext } from "../context/rowContext"


export const useRow = ()=>{
    const data = useContext(RowContext);
    return data;
}