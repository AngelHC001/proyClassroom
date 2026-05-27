import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../genUser-sections/AuthContext";
import { useView } from "../components/viewContext";
const IMGPATH = '../appUserData/';


function ProfileArea(){
    const { user, logout } = useAuth();  //user es un objeto, recuperado del login
    const { activeView, setActiveView } = useView(); //CONTEXTO DE COMPONENTE RIGHT SIDE
    
    const navigate = useNavigate();
    
    const btnLabel = activeView.type === 'my_posts' ? 'Volver' : 'Mis Posts';
    const btnLabel2 = activeView.type === 'my_profile' ? 'Volver' : 'Mi Perfil';

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return(
        <div className="row text-center p-2">   
            <div className="col border-dark border-end">
                <h3>{user?.nombre}</h3>
                <img className="img-fluid rounded" src={IMGPATH + user?.imgPerfil} width="80" height="80" alt="userProfile"/>
                <p>{user?.matricula}</p>
            </div>

            <div className="col d-flex flex-column gap-2 mt-3">
                {  
                    user?.tipo === 1 && 
                        (<Link className="btn btn-outline-light btn-admin" to="/admin-section">
                            <i className="bi bi-journal-check"/> Administrar
                        </Link>)  
                }
                
                <button className="btn btn-outline-light btn-admin" onClick={() => 
                    setActiveView(activeView.type === 'my_posts' ? {type : 'feed'} : {type : 'my_posts'} )}>
                    <i className="bi bi-stickies-fill"></i> {btnLabel}
                </button>

                <button className="btn btn-success" onClick={() => 
                    setActiveView(activeView.type === 'my_profile' ? {type : 'feed'} : {type:'my_profile'})}>
                    <i className="bi bi-person-fill"></i> {btnLabel2}
                </button>
            
                <button className="btn btn-dark" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left"></i> Cerrar Sesion
                </button>
            </div>      
        </div>    
    )
}

export default ProfileArea;