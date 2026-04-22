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

    const updateUser = (newData) => {
        const updated = { ...user, ...newData };
        localStorage.setItem("alumno", JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => {
        localStorage.removeItem("alumno");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);