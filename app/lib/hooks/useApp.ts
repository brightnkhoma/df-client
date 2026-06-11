import React from "react";
import { AppContext } from "../context/context";


export const useApp = () => {
    const data = React.useContext(AppContext);
    return data;
}