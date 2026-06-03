import React, { useState } from "react";
import { useView } from "./viewContext";
import { usePostMutations } from "../genUser-actions/usePostMutations";
import FileContainer from "./file_container";

const APIURL = import.meta.env.VITE_API_URL;
const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false // formato 24h
};

//AREA DE BOTONES
const class_button = "btn btn-outline-light btn-sm border-0"

//Like
const LikeButton = ({ likes, onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className="bi bi-check-circle text-success fs-4"/> {likes}
    </button>
);

//Comment
const CommentButton = ({ comentarios, disabled, onClick }) => (
    <button className={class_button} disabled={disabled} onClick={onClick}>
        <i className="bi bi-chat fs-4"/> {comentarios}      
    </button>
);

// Botón para Activar/Desactivar Edición
const EditToggleButton = ({ isOnEdit, onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className={`text-primary fs-4 bi ${isOnEdit ? 'bi-x' : 'bi-pencil-fill'}`}/>      
    </button>
);

// Botón para Confirmar la Edición (Enviar)
const SaveButton = ({ onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className="text-dark fs-4 bi bi-send-check"/>      
    </button>
);

// Botón de Eliminar
const DeleteButton = ({ onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className="bi bi-trash-fill text-danger fs-4"/>      
    </button>
);


//EL POST TEMPLATE
function Post({PostData}){
    const { activeView, setActiveView } = useView(); 
    
    // Mutaciones limpias desde el Hook
    const { updateMutation, likeMutation, deleteMutation } = usePostMutations(PostData);

    //Ajustes FRONT END
    const fecha = new Date(PostData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    const isManageEnabled = (activeView.type === 'my_posts') || (activeView.type === 'manage_posts');
    const isMyPost = activeView.type === 'my_posts';
    const fileChain = PostData?.stringfiles.split('-') ?? [];

    //EDITAR POST
    const [isOnEdit, setIsOnEdit] = useState(false)
    const [editData, setEditData] = useState({newTitle: PostData?.titulo, newContent: PostData?.contenido});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({...prev, [name]:value}))
    }

    const handleUpdateClick = () => 
    {
        updateMutation.mutate(editData);
        setIsOnEdit(!isOnEdit);
    }

    return(
        <div className="card border-0 post text-light me-2">
            <div className="card-header border-light d-flex justify-content-between align-items-center">
                { 
                    isOnEdit ? 
                        <div className="col-sm-6">
                            <input className="form-control" type="text" name="newTitle"
                                onChange={handleChange} value={editData.newTitle}/>  
                        </div>
                        : <h3 className="col-sm-6">{PostData?.titulo}</h3>
                }
              
                <div className="row col-sm-4 text-center">
                    <span className="mb-1"><b>{PostData?.remitente}</b></span>
                    <span className="border-top mt-1">{fechaFormateada}</span>
                </div>
            </div>
            
            <div className="card-body">
                {
                   isOnEdit ? 
                        <textarea className="form-control" name="newContent" 
                           onChange={handleChange} value={editData.newContent}/> 
                        :
                        <p>{PostData?.contenido}</p>
                }

                {  PostData?.stringfiles && 
                        (<div className="d-flex flex-row align-items-center justify-content-center gap-2">
                             { fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) }   
                        </div>)
                }
            </div>

            <div className="card-footer border-top-light d-flex gap-2">
                <LikeButton likes={PostData?.likes} onClick={() => likeMutation.mutate(PostData?.idPost)}/>
                
                <CommentButton
                    comentarios={PostData?.comentarios} 
                    disabled={activeView.type === 'comment'}
                    onClick={() => setActiveView({type: 'comment', 
                        postTarget: Object.values(PostData)}) }/>
             
                { isMyPost && <EditToggleButton isOnEdit={isOnEdit} 
                                    onClick={() => setIsOnEdit(!isOnEdit)}/> }

                { isOnEdit && <SaveButton onClick={handleUpdateClick}/> }

                { isManageEnabled &&  
                    <DeleteButton onClick={() => deleteMutation.mutate([PostData?.idPost, PostData?.stringfiles])}/>      
                }
            </div>
        </div>
    )
}

export default Post;