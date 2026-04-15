import React from "react";
import { useAuth } from "../genUser-sections/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
            <div className="col border-dark border-end">
                <h3>{user?.nombre}</h3>
                <img className="rounded" src={IMGPATH + user?.imgPerfil} width="80" height="80" alt="userProfile"/>
                <p>{user?.matricula}</p>
            </div>

            <div className="col d-flex flex-column gap-2 mt-3">
                {user?.tipo === 0 ? 
                        <>
                            <button className="btn btn-outline-light btn-admin" onClick={() => 
                                setActiveView(activeView === 'my_posts' ? 'posts' : 'my_posts')}>
                                <i className="bi bi-stickies-fill"></i> {btnLabel}
                            </button>

                            <button className="btn btn-success" onClick={() => 
                                setActiveView(activeView === 'my_profile' ? 'posts' : 'my_profile')}>
                                <i className="bi bi-person-fill"></i> {btnLabel2}
                            </button>
                        </>
                    :
                        <Link className="btn btn-outline-light btn-admin" to="/admin-section">
                            <i className="bi bi-journal-check"></i> Administrar
                        </Link>  
                }

                <button className="btn btn-dark" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-left"></i> Cerrar Sesion
                </button>
            </div>      
               
        </div>    
    )
}




export function PostArea(){
    const { user } = useAuth();
    const [postData,setpostData] = useState({remitent: user, title:'',content:'',files:''});
    
    
    const handleChange = (e) => {
        const {name,value} = e.target;
        setpostData((prev) => ({
            ...prev,
            [name]:value 
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //HACER REQUEST
        try {
            const response = await fetch('http://localhost:3000/api/upload_post',{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(postData)
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Algo salio mal');
            }

            //Resultados
            const result = await response.json(); 
            alert(result.message);
        } catch (error) {
            console.error('Error al registrar:', error.message);
            alert(`Hubo un problema: ${error.message}`);
        }
    }

    return(
        <div className="p-2">
            <h3 className="display-6">Publicar</h3>
            
            <form className="d-flex flex-column gap-2" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input className="form-control" name="title" type="text" placeholder="Titulo"
                value={postData.title} onChange={handleChange} />
                
                <textarea className="form-control" name="content" placeholder="Escribe algo..."
                value={postData.content} onChange={handleChange}/> 
                
                <div className="d-flex flex-row gap-3"> 
                    <label className="btn btn-outline-dark">
                        <i className="bi bi-paperclip"></i>    
                        <input name="files[]" type="file" multiple title="Adjuntar Archivo"/>
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
