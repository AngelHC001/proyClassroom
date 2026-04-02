import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null); 

export const AuthProvider = ({children}) => {
    // Al iniciar, intenta recuperar el usuario de localStorage
    const [user,setUser] = useState(()=>{
        const stored = localStorage.getItem("alumno");
        return stored ? JSON.parse(stored) : null;
    }); 
    
    //definir el localStorage en el login
    const login = (userData) => {
        localStorage.setItem("alumno", JSON.stringify(userData));
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem("alumno");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);