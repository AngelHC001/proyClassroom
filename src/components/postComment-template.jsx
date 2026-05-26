import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from '../genUser-sections/AuthContext.jsx';
import {useView} from './viewContext.jsx';
import FileContainer from '../components/file_container.jsx';

const API_URL = import.meta.env.VITE_API_URL;

const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24h
};

function Comment({CommentData, isForManage = false, isEditable = false}){
    const {user} = useAuth();
    const {activeView} = useView();
    const queryClient = useQueryClient();

    const fecha = new Date(CommentData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    const fileChain = CommentData?.stringfiles.split('-') ?? [];

    const deleteCommentMutation = useMutation({
        mutationFn: async([idComment, idPost, idUser, stringfiles])=> {
            if(!confirm('¿Borras tu comentario?')){ return; }

            const response = await fetch(`${API_URL}/comments/erase_comment`, {
                method: 'DELETE',
                headers: {'Content-Type':'Application/json'},
                body: JSON.stringify({ idComment: idComment, idPost:idPost, 
                    idUsuario:idUser, stringTarget: stringfiles })
            });

            if(!response.ok){
                throw new Error('Algo salio mal (Comentario)')
            }
            return response.json();
        },
        
        onSuccess: async() => {
            queryClient.invalidateQueries({queryKey:['posts', activeView.type, user?.id]});
        },

        enabled: !!user?.id
    });

    return(
        <div className="rounded p-1 comment">
            <div className="d-flex justify-content-between border-bottom">
                <span>{CommentData?.remitente}</span>
                <span>{fechaFormateada}</span>
            </div>
            
            <p>{CommentData?.contenido}</p>

            <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                {
                    CommentData?.stringfiles && fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) 
                }   
            </div>
        
            {
               isEditable &&
                    <button className="btn btn-outline-light border-0 rounded-circle"
                       >
                        <i className="bi bi-pencil"/>
                    </button>
            }
 
            { 
                isForManage && 
                    <button className="btn btn-outline-light border-0 rounded-circle" 
                      onClick={ () => {deleteCommentMutation.mutate([
                                CommentData?.idComentario, CommentData?.idPost, 
                                CommentData?.idUsuario, CommentData?.stringfiles]);
                            }}>
                        <i className="bi bi-dash-circle"/>
                    </button>   
            }
        </div>
    )
}

export default Comment;