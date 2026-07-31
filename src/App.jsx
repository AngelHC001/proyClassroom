import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from './genUser-sections/AuthContext.jsx'

import MainNav from "./components/nav.jsx";
import MainSection from "./main-sections/main_section.jsx";
import AdminSection from "./teacher-sections/admin-section.jsx";
import Login from "./genUser-sections/login.jsx";
import './index.css'

const API_URL = import.meta.env.VITE_API_URL;


const HomeBracket = ({routeName}) => {
  return(
    <>
      <MainNav/>
      {routeName === "admin-section" ? <AdminSection/> : <MainSection/>}
    </>
  )
}

function App() {
  const { user } = useAuth();

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
        <Route path="/login" element={<Login/>}/>

        <Route path="/" element={user ? 
          <HomeBracket routeName={"/"} replace/> : 
          <Navigate to={"/login"}/>} />

        <Route path="/admin-section" element={user ? 
          <HomeBracket routeName={"admin-section"} replace/> : 
          <Navigate to={"/login"} /> }/>
    </Routes>
  )
}

export default App;
