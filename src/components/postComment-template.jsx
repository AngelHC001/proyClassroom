import React, { useState } from "react";

import { useCommentMutations } from "../genUser-actions/useCommentMutations.js";
import { useAuth } from '../genUser-sections/AuthContext.jsx';
import FileContainer from '../components/file_container.jsx';

const opciones = { timeZone: "America/Mexico_City",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false 
};

const class_button = 'btn btn-outline-light border-0 rounded-circle'

// Botón para Activar/Desactivar Edición
const EditToggleButton = ({ isOnEdit, onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className={`bi ${isOnEdit ? 'bi-x' : 'bi-pencil-fill'}`}/>      
    </button>
);

// Botón para Confirmar la Edición (Enviar)
const SaveButton = ({ onClick }) => (
    <button className={class_button} onClick={onClick}>
        <i className="bi bi-send-check"/>      
    </button>
);

function Comment({CommentData}){
    const { user } = useAuth();
    const { updateMutation, deleteMutation } = useCommentMutations();
    
    const [isOnEdit, setIsOnEdit] = useState(false);
    const [editData, setEditData] = useState({newContent: CommentData?.contenido});

    const isMyComment = CommentData?.remitente === `${user?.matricula}-${user?.nombre}`;
    const isAuthorized = user?.tipo === 1;

    const fecha = new Date(CommentData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    const fileChain = CommentData?.stringfiles.split('-') ?? [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({...prev, [name]:value}))
    }

    const handleUpdateClick = () => {
        updateMutation.mutate([editData.newContent,CommentData?.idPost, CommentData?.idComentario])
        setIsOnEdit(!isOnEdit);
    }

    return(
        <div className="rounded p-1 comment">
            <div className="d-flex justify-content-between border-bottom">
                <span>{CommentData?.remitente}</span>
                <span>{fechaFormateada}</span>
            </div>
            
            {
                isOnEdit ? 
                    (<div className="p-2">
                         <textarea className="form-control" name="newContent" value={editData.newContent} 
                         onChange={handleChange}/>
                    </div>) 
                    : 
                    (<p>{CommentData?.contenido}</p>)
            }

            <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                { CommentData?.stringfiles && 
                        fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) }   
            </div>
                
            { isMyComment && <EditToggleButton isOnEdit={isOnEdit} 
                                    onClick={() => setIsOnEdit(!isOnEdit)}/> }

            { isOnEdit && <SaveButton onClick={handleUpdateClick}/> }
 
            { 
                (isMyComment || isAuthorized) && 
                    (<button className={class_button} 
                            onClick={ () => {deleteMutation.mutate([CommentData?.idComentario, CommentData?.idPost, 
                                                        CommentData?.idUsuario, CommentData?.stringfiles]);}}>
                        <i className="bi bi-dash-circle"/>
                    </button>)   
            }
        </div>
    )
}

export default Comment;