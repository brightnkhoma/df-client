import { createContext } from "react";
import { Row } from "../types/row";

interface Props{
    rows : Row[];
    selectedRows : string[];
    onRowClick: (rowId: string, e: MouseEvent) => void;
    deleteSelectedRows: () => Promise<void>

}


const initialState : Props = {
    rows: [],
    selectedRows: [],
    onRowClick: function (rowId: string, e: MouseEvent): void {
        throw new Error("Function not implemented.");
    },
    deleteSelectedRows: function (): Promise<void> {
        throw new Error("Function not implemented.");
    }
}


const TableContext = createContext(initialState);

export {TableContext};