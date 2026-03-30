import { Routes, Route, Navigate } from "react-router-dom";

import MainNav from "./components/nav.jsx";
import MainSection from "./main-sections/main_section.jsx";
import AdminSection from "./teacher-sections/admin-section.jsx";
import Login from "./genUser-sections/login.jsx";
import Register from "./genUser-sections/register.jsx";

import './index.css'


// Un componente simple para envolver rutas privadas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = false; // Aquí conectarías tu lógica de Auth (contexto/redux)
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Rutas Públicas (Sin NavBar) */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register />} />
    
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
