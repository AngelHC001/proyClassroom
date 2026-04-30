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
                <img className="img-fluid rounded" src={IMGPATH + user?.imgPerfil} width="80" height="80" alt="userProfile"/>
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


export function PostArea({onPost}){
    const { user } = useAuth();
    const [message, setMessage] = useState({color:'secondary', text:''});
    const [postData,setpostData] = useState({remitent: user, title:'',content:''});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const MAX = 5;
    
    const handleChange = (e) => {
        const {name,value} = e.target;
        setpostData((prev) => ({
            ...prev,
            [name]:value 
        }));
    }

    const handleFiles = (e) => {
        const filesPack = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/'));
            
        setSelectedFiles(prev => {
            // Evitar duplicados por nombre
            const existing = new Set(prev.map(f => f.name));
            const nuevos = filesPack.filter(f => !existing.has(f.name));
        
            // Acumular y respetar el límite MAX
            return [...prev, ...nuevos].slice(0, MAX);
        });
    }

    const clearFields = () =>{
        setpostData({remitent: user, title:'',content:''});
        setSelectedFiles([]);
        document.getElementById('input-file').value = '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('remitent', JSON.stringify(postData.remitent));
        formData.append('title',postData.title);
        formData.append('content', postData.content);
       
        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        //HACER REQUEST
        try {
            const response = await fetch('http://localhost:3000/api/posts/upload_post',{
                method:'POST',
                body: formData
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Algo salio mal');
            }

            //Resultados
            const result = await response.json(); 
            setMessage({color: 'success', text: result.message});
            clearFields();
            
            onPost();
        } catch (error) {
            console.error('Error al registrar:', error.message);
            setMessage({color: 'danger', text: 'Error Algo salió mal'});
        }
    }

    return(
        <div className="p-2">
            <div className="d-flex flex-row align-items-center gap-2">
                <h4>Publicar</h4>
                <div className={`alert alert-${message.color}`} role="alert">{message.text}</div>
            </div>
           
            <form className="d-flex flex-column gap-2" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input className="form-control" name="title" type="text" placeholder="Titulo"
                value={postData.title} onChange={handleChange} />
                
                <textarea className="form-control" name="content" placeholder="Escribe algo..."
                value={postData.content} onChange={handleChange}/> 
                
                <div className="d-flex flex-row gap-3"> 
                    <label className="btn btn-outline-dark">
                        <i className="bi bi-paperclip"></i>    
                        <input id="input-file" name="selectedFiles" type="file" multiple accept="image/*" 
                         disabled={selectedFiles.length >= MAX} onChange={handleFiles} title="Adjuntar Imagenes"/>
                    </label>
                    
                    <button className="btn btn-outline-danger" type="button" title="Deshacer mensaje"
                    onClick={clearFields}>
                        <i className="bi bi-x-square"></i> 
                    </button>
                            
                    <button className="btn btn-outline-primary" type="submit" title="Enviar">
                        <i className="bi bi-send"></i>
                    </button>
                </div> 

                {
                    selectedFiles.length > 0 && 
                    (<span>
                        <i className="bi bi-image-fill"/> {selectedFiles.length}/{MAX}
                        <ul>{selectedFiles.map((file,i) => (
                                <li key={i}>{file.name}</li>))}
                        </ul>
                    </span>)
                }
            </form>
        </div>  
    )
}
