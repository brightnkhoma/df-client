"use client";

import { TableContext } from "@/app/lib/context/tableContext";
import { useApp } from "@/app/lib/hooks/useApp";
import { showToast } from "@/app/lib/toast/toast";
import { Row } from "@/app/lib/types/row";
import React, { useCallback, useMemo, useState } from "react";



export const TableWrapper = ({children} : {children : React.ReactNode})=>{
    const [rows, setRows] = useState<Row[]>([]);
    const [selectedRows,setSelectedRows] = useState<string[]>([]);
    const [isDeletingRows, setIsDeletingRows] = useState<Record<string,boolean>>({});
    const {api} = useApp();
    const db = useMemo(()=>api.getDb<Row>("row"),[api]);
    const [loading,setLoading] = useState<boolean>(false);


    const onRowClick = (rowId : string,e : MouseEvent)=>{
        if(e.ctrlKey){
          return  setSelectedRows(getSelectedRowsSet(rowId));
        }
        if(e.shiftKey){
            const last = selectedRows[selectedRows.length-1];
            if(last){
                const index = rows.findIndex(x=>x.id == last);
                if(index == -1) return;
                const lastIndex = rows.findIndex(x=>x.id == rowId);
                if(lastIndex == -1) return;
                const min = Math.min(index,lastIndex);
                const max = Math.max(index,lastIndex);
                const selectesIds = rows.slice(min,max).map(x=>x.id);
                return setSelectedRows(getSelectedRowsSet(...selectesIds));
            }
        }
        setSelectedRows([rowId])

    }
    const getSelectedRowsSet = (...item : string[])=>{
        return [...new Set(selectedRows),...item].filter(i => i!=undefined)

    }


    const deleteRow = useCallback(async(rowId : string)=>{
        try {
            setIsDeletingRows(x=>({...x,[rowId] : true}));
            const success = await db.delete(rowId);
            if(!success)throw new Error("Failed to delete.")            
        } catch (error) {
            console.log(error);
            showToast("error",{description : `Failed to delete row : ${rowId}`})
            
        }finally{
            setIsDeletingRows(x=>({...x,[rowId] : false}))

        }

        
    },[setIsDeletingRows,isDeletingRows,db])


    const deleteSelectedRows = async()=>{
        await Promise.all(selectedRows.map(x=>deleteRow(x)));
    }


return(
    <TableContext.Provider value={{rows,selectedRows,onRowClick,deleteSelectedRows}}>
        {children}
    </TableContext.Provider>
)
}