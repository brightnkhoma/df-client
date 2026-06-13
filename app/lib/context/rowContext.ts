import { createContext } from "react";
import { Row } from "../types/row";
import { Cell } from "../types/cell";

interface Props{
    row : Row;
    onSaveChanges : ()=> Promise<void>;
    onEditCell : (cellId :string,updates : Cell["value"])=>void;
    onDeleteRow : ()=> Promise<boolean>;
    isDeleting: boolean;
    hasChanges: boolean;
    isSaving: boolean;
    onCellClick: (cellId: string, e: MouseEvent) => void;
    selectedCells: string[]

}


const initialState : Props ={
    row: {} as Row,
    onSaveChanges: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    onEditCell: function (cellId: string): void {
        throw new Error("Function not implemented.");
    },
    onDeleteRow: function (): Promise<boolean> {
        throw new Error("Function not implemented.");
    },
    isDeleting: false,
    hasChanges: false,
    isSaving: false,
    onCellClick: function (cellId: string, e: MouseEvent): void {
        throw new Error("Function not implemented.");
    },
    selectedCells: []
}


const RowContext = createContext(initialState);

export {RowContext}