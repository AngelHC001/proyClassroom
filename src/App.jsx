import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import MainNav from "./components/nav.jsx";
import MainSection from "./main-sections/main_section.jsx";
import AdminSection from "./teacher-sections/admin-section.jsx";
import Login from "./genUser-sections/login.jsx";

import {useAuth} from './genUser-sections/AuthContext.jsx'
import './index.css'
const API_URL = import.meta.env.VITE_API_URL;

// Un componente simple para envolver rutas privadas
//si hay usuario ejecuta MainSection, sino retorna al login
const PrivateRoute = ({ children }) => {
  const user = useAuth();  //Lee contexto de login
  return user ? children : <Navigate to="/login" />;
};


function App() {
  useEffect(() => {
      const INTERVAL = 8 * 60 * 1000;
      const sendPing = async() => {
          try {
            //mantener vivo durante operacion
            await fetch(`${API_URL}/ping`, { method: 'HEAD', mode: 'no-cors' });
            console.log('Ping enviado');
          
          } catch (error) {
              console.error('Error en ping ', error);
          }
        };

        sendPing();
        //Configurar repeticiones
        const intervalId =  setInterval(sendPing, INTERVAL);
        return () => clearInterval(intervalId);
  },[]);


  return (
    <Routes>
      {/* Rutas Públicas (Sin NavBar) */}
      <Route path="/login" element={<Login/>}/>
    
      {/* Rutas Privadas (Con NavBar) */}
      <Route path="/"
        element={
          <PrivateRoute>
            <MainNav/>
            <MainSection/>
          </PrivateRoute>
        }
      />

      <Route path="/admin-section"
        element={
          <PrivateRoute>
            <MainNav />
            <AdminSection />
          </PrivateRoute>
        }
      />
    
      {/* Redirección por defecto si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App;
