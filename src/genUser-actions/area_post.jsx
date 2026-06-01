import React from "react";
import { useState } from "react";
import { usePostMutations } from "./usePostMutations";

import { useAuth } from "../genUser-sections/AuthContext";
import { useView } from "../components/viewContext";


function PostArea(){
    const { user } = useAuth();
    const { activeView } = useView();
    const { postMutation } = usePostMutations();

    const [message, setMessage] = useState({color:'secondary', text:''});
    const [postData,setpostData] = useState({remitent: user, title:'',content:''});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const MAX = 5;

    const lockEmptyPost = postData.title === '' && postData.content === '';
  
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

    const createPostPayload = (postData) => ({
        title: postData.title,
        content: postData.content,
        remitent: JSON.stringify(postData.remitent),
        mode: 'feed'
    });

    const createCommentPayload = (postData, targetId) => ({
        postTarget: targetId,
        content: postData.content,
        remitent: JSON.stringify(postData.remitent),
        mode: 'comment'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isComment = activeView.type === 'comment';

        if((isComment && postData.content === '') || (activeView.type === 'feed' && lockEmptyPost)){
            setMessage({color: 'secondary', text: 'No hay nada'});
            return;
        }

        const payload = isComment ? createCommentPayload(postData, activeView?.postTarget[0]):
                                    createPostPayload(postData);
        
        //Rellenar formData
        const formData = new FormData();

        Object.entries(payload).forEach(([key,value]) => {
            if(value !== undefined) formData.append(key,value)
        });

        //FILES
        selectedFiles.forEach((file) => { formData.append('images', file); });

        //REQUEST
        try {
            postMutation.mutateAsync(formData);
            clearFields();       
            setMessage({color: 'success', text: 'Publicado'});
        } catch (error) {
            console.error(error.message);
            setMessage({color: 'danger', text: 'Error Algo salió mal'});
        }
    }


    return(
        <div className="p-2">
            <div className="d-flex flex-row align-items-center gap-2">
                <h4>{activeView.type === 'comment' ? 'Comentar' : 'Publicar'}</h4>
                {
                    message.text && 
                        <div className={`alert alert-${message.color}`} role="alert">{message.text}</div>
                }
            </div>
           
            <form className="d-flex flex-column gap-2" encType="multipart/form-data" onSubmit={handleSubmit}>
                {
                    activeView.type === 'feed' &&  
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
