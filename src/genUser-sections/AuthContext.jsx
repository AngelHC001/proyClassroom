import { createContext, useContext, useEffect, useState } from "react";

//IMPORTAR CREATE, USE
//EXPORTAR VARIABLE DE CREACION
//EXPORTAR HOOK DE CREACION

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null); 

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    //VerificarLogin
    /*useEffect(() => {
        const verificarSesion = async() => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/session/verify`,{
                    method: 'GET',
                    credentials: 'include'
                });

                if(response.ok){
                    const data = await response.json();
                    setUser(data.usuario);
                }
                else{
                    setUser(null);
                }
            } catch (error) {
                console.log('Sin sesion previa o token expiro ' + error);
            }
            finally{
                setLoading(false);
            }
        }//funcion

        verificarSesion();
    },[]);*/

    //Definir el localStorage en el login
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
    }

    const updateUser = (newData) => {
        const updated = { ...user, ...newData };
        setUser(updated);
    };

    const logout = async() => {
        try {
            //RETIRAR LA COOKIE
            await fetch(`${API_URL}/session/exit`,{
                method: 'GET',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error al revocar la cookie ' + error);
        }
        finally{
            setUser(null);
            setToken(null);
        }
    };

    
    if (loading) {
        return (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
                <h3>Comprobando credenciales seguras...</h3>
            </div>);
    }

    return(
        <AuthContext.Provider value={{user, login, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);