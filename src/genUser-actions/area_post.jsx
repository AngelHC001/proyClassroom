import React from "react";
import { useState } from "react";
import { useAuth } from "../genUser-sections/AuthContext";
import { useView } from "../components/viewContext";

const APIURL = import.meta.env.VITE_API_URL;


function PostArea(){
    const { user } = useAuth();
    const { activeView } = useView();

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
        
        if(activeView.type === 'feed'){
            formData.append('title',postData.title);
        }
        
        if(activeView.type === 'comment'){
            console.log(activeView.postTarget);
            formData.append('postTarget', activeView?.postTarget[0]);
        }
        
        formData.append('mode', activeView.type);
        formData.append('content', postData.content); 
        formData.append('remitent', JSON.stringify(postData.remitent));
       
        //FILES
        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        //HACER REQUEST
        try {
            const response = await fetch(`${APIURL}/posts/upload_post`,{
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
            
        } catch (error) {
            console.error('Error al registrar:', error.message);
            setMessage({color: 'danger', text: 'Error Algo salió mal'});
        }
    }

    return(
        <div className="p-2">
            <div className="d-flex flex-row align-items-center gap-2">
                <h4>{activeView.type === 'comment' ? 'Comentar' : 'Publicar'}</h4>
                {
                    message.text && 
                        <div className={`alert alert-${message.color}`} 
                        role="alert">{message.text}</div>
                }
            </div>
           
            <form className="d-flex flex-column gap-2" encType="multipart/form-data" onSubmit={handleSubmit}>
                {
                    activeView.type === 'comment' ? '' : 
                    <input className="form-control" name="title" type="text" placeholder="Titulo"
                    value={postData.title} onChange={handleChange} />
                }
                
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

export default PostArea;
