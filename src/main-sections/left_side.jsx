import React from "react";
import { useAuth } from "../genUser-sections/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const IMGPATH = '../appUserData/';

export function ProfileArea({activeView, setActiveView}){
    const { user, logout } = useAuth();  //user es un objeto, recuperado del login
    const navigate = useNavigate();
    
    const btnLabel = activeView === 'my_posts' ? 'Volver' : 'Mis Posts';
    const btnLabel2 = activeView === 'my_profile' ? 'Volver' : 'Mi Perfil';

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return(
        <div className="row text-center p-2">   
            <div className="col border-end">
                <h3>{user?.nombre}</h3>
                <img className="rounded" src={IMGPATH + user?.imgPerfil} width="80" height="80" alt="userProfile"/>
                <p>{user?.matricula}</p>
            </div>

            <div className="col d-flex flex-column mt-3">
                {user?.tipo === 0 ? 
                        <>
                            <button className="btn btn-primary mb-1" onClick={() => 
                                setActiveView(activeView === 'my_posts' ? 'posts' : 'my_posts')}>{btnLabel}</button>
                            <button className="btn btn-secondary mb-1" onClick={() => 
                                setActiveView(activeView === 'my_profile' ? 'posts' : 'my_profile')}>{btnLabel2}</button>
                        </>
                    :   
                        <button className="btn btn-primary">Administrar</button>
                }

                <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left"></i> Cerrar Sesion
                </button>
            </div>      
               
        </div>    
    )
}


export function PostArea(){
    return(
        <div className="col p-2">
            <h3>Publicar</h3>
            
            <form encType="multipart/form-data">
                <input className="form-control mb-2" name="titulo" type="text" placeholder="Titulo"/>
                <textarea className="form-control" name="contenido"  placeholder="Escribe algo..."></textarea>   
                    
                <div id="archivos"></div>
                
                <br/>
                
                <div className="d-flex gap-3"> 
                    <label className="btn btn-outline-secondary">
                        <i className="bi bi-paperclip"></i>    
                        <input name="archivo[]" type="file" multiple title="Adjuntar Archivo"/>
                    </label>
                    
                    <button className="btn btn-outline-danger" title="Deshacer mensaje">
                        <i className="bi bi-x-square"></i> 
                    </button>
                            
                    <button className="btn btn-outline-primary" type="submit"  title="Enviar">
                        <i className="bi bi-send"></i>
                    </button>
                </div> 
            </form>
        </div>  
    )
}
