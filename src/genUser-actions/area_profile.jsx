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

    const buttons = [
        user?.tipo === 1 && {
            key: 'admin',
            className: 'btn btn-outline-light btn-admin border-0',
            label: 'Ver Grupo',
            icon: 'bi bi-journal-check',
            callback: () => navigate('/admin-section')
        },
        {
            key: 'posts',
            className: 'btn btn-outline-light btn-admin border-0',
            label: btnLabel,
            icon: 'bi bi-stickies-fill',
            callback: () => setActiveView(activeView.type === 'my_posts' ? {type : 'feed'} : {type : 'my_posts'})
        },
        {
            key: 'profile',
            className: 'btn btn-outline-light btn-user border-0',
            label: btnLabel2,
            icon: 'bi bi-person-fill',
            callback: () => setActiveView(activeView.type === 'my_profile' ? {type : 'feed'} : {type:'my_profile'})
        },
        {
            key: 'logout',
            className: 'btn btn-dark border-0',
            label: 'Cerrar Sesion',
            icon: 'bi bi-box-arrow-left',
            callback: handleLogout
        }
    ].filter(Boolean);

    return(
        <div className="row text-center p-2">   
            <div className="col border-dark border-end">
                <h3>{user?.nombre}</h3>
                <img className="img-fluid rounded" src={IMGPATH + user?.imgPerfil} width="80" height="80" alt="userProfile"/>
                <p>{user?.matricula}</p>
            </div>

            <div className="col d-flex flex-column gap-2 mt-3">
                {buttons.map(b => (
                    <button key={b.key} className={b.className} onClick={b.callback}>
                        <i className={b.icon}></i> {b.label}
                    </button>
                ))}
            </div>      
        </div>    
    )
}

export default ProfileArea;