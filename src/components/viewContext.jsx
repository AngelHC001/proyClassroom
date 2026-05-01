import React from "react";
import { createContext, useContext } from "react";

//1. CREATE CONTEXT, USE CONTEXT
//2. CREAR VARIABLE DE EXPORT
//3. CREAR HOOK DE EXPORT

export const ViewContext = createContext(null);

export function useView(){
    const ctx = useContext(ViewContext);
    if(!ctx) throw new Error('Use view debe usarse en MainSection');
    return ctx;
}