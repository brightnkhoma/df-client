"use client";
import { RowContext } from "@/app/lib/context/rowContext";
import { useApp } from "@/app/lib/hooks/useApp";
import { useTable } from "@/app/lib/hooks/useTable";
import { showToast } from "@/app/lib/toast/toast";
import { Cell } from "@/app/lib/types/cell";
import { Row } from "@/app/lib/types/row";
import { ReactNode, useCallback, useMemo, useState } from "react";

export const RowWrapper = ({_row,children}:{_row: Row,children : ReactNode})=>{
    const {api} = useApp();
    const [row, setRow] = useState<Row>(_row)
    const {onRowClick} = useTable();
    const [selectedCells, setSelectedCells] = useState<string[]>([]);
    
    const db = useMemo(()=>api.getDb<Row>("row"),[api]);
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [hasChanges, setHasChanges] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false);


    const onDeleteRow = useCallback(async()=>{
        try {
            setIsDeleting(true);
            return await db.delete(row.id)
        } catch (error) {
            console.log(error);
            showToast("error",{description : `Failed to delete row : ${row.id}`});
            return false;
            
        }finally{
            setIsDeleting(false)
        }

    },[db,isDeleting,setIsDeleting]);

    const onEditCell = useCallback((cellId : string,value : Cell["value"])=>{
        setRow(r=>({...r,cells : {...r.cells,[cellId] : {...r.cells[cellId],value}}}));
        setHasChanges(true)
    },[row,_row,hasChanges]);

    const onSaveChanges = useCallback(async()=>{
        try {
            if(isSaving || !hasChanges) return;
            const {id,...updates} = row
            const success = await db.update(id,updates);
            if(!success)throw new Error("Failed to update row.")
            
        } catch (error) {
            console.log(error);            
            showToast("error",{description : `Failed to save changes of row : ${row.id}`});
        }finally{
            setIsSaving(false)
        }
    },[db,isSaving,setIsSaving,row,hasChanges,setHasChanges])


     const onCellClick = (cellId : string,e : MouseEvent)=>{
        if(e.ctrlKey){
          return  setSelectedCells(getSelectedCellsSet(cellId));
        }

        if(e.shiftKey){
            const last = selectedCells[selectedCells.length-1];
            if(last){
                const cells = Object.values(row.cells)
                const index = cells.findIndex(x=>x.id == last);
                if(index == -1) return;
                const lastIndex = cells.findIndex(x=>x.id == cellId);
                if(lastIndex == -1) return;
                const min = Math.min(index,lastIndex);
                const max = Math.max(index,lastIndex);
                const selectesIds = cells.slice(min,max).map(x=>x.id);
                return setSelectedCells(getSelectedCellsSet(...selectesIds));
            }
        }
        setSelectedCells([cellId])
        onRowClick(row.id,e)

    }
    const getSelectedCellsSet = (...item : string[])=>{
        return [...new Set(selectedCells),...item].filter(i => i!=undefined)

    }



    return(
        <RowContext.Provider value={{row,onDeleteRow,onEditCell,onSaveChanges,hasChanges,isDeleting,isSaving,onCellClick,selectedCells}}>
            {children}
        </RowContext.Provider>
    )

}