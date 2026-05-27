import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useView } from "./viewContext";
import { useAuth } from "../genUser-sections/AuthContext";

import FileContainer from "./file_container";
const APIURL = import.meta.env.VITE_API_URL;

const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24h
};


// En el botón de comentarios dentro de PostContainer
function Post({PostData}){
    const [isOnEdit, setIsOnEdit] = useState(false)
    //const [editData, setEditData] = useState(PostData);
    

    const { activeView, setActiveView } = useView(); 
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const fecha = new Date(PostData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    
    const isManageEnabled = (activeView.type === 'my_posts') || (activeView.type === 'manage_posts');
    const isMyPost = activeView.type === 'my_posts';
    const fileChain = PostData?.stringfiles.split('-') ?? [];

    //FUNCION LIKE DEL POST
    const likeMutation = useMutation({
        mutationFn: async (idPost) => {
            const response = await fetch(`${APIURL}/posts/like_post/${idPost}`, { method:'GET' });

            if (!response.ok) throw new Error('Error al procesar el like');
            return response.json();
        },
        
        onMutate: async(idPost) => {
            const queryKey = ['posts', activeView.type, user?.id];
            await queryClient.cancelQueries({ queryKey });

            const previusPosts = queryClient.getQueryData(queryKey);
        
            //Actualizar Cache
            queryClient.setQueryData(queryKey, (oldData) => {
                return oldData.map((post) => {
                    if(post.idPost === idPost)
                        return { ...post, likes: post.likes + 1 }             
                    return post;
                });
            });
            return { previusPosts };
        },

        onError: (err, idPost, context) => {
            const queryKey = ['posts', activeView.type, user?.id];
            if (context?.previousPosts) {
                queryClient.setQueryData(queryKey, context.previousPosts);
            }
            console.error("No se pudo dar like, revirtiendo...");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', activeView.type, user?.id] });
        }      
    });

    //FUNCION ON DELETE
    const deleteMutation= useMutation({
        mutationFn: async ([postId, stringfiles]) => {
            if(!confirm('Borras este post?')){ return; }

            const response = await fetch(`${APIURL}/posts/erase_post`, { 
                method: 'DELETE',
                headers: {'Content-Type': 'Application/json'},
                body: JSON.stringify({postTarget: postId, stringTarget: stringfiles})
            });
            if(!response.ok) throw new Error('Error al borrar post (POST)'); 
            return response.json();
        },

        onMutate: async(idPost) => {
            await queryClient.cancelQueries({ queryKey: ['posts', activeView.type, user?.id] });
            const previousPosts = queryClient.getQueryData(['posts', activeView.type, user?.id]);
            queryClient.setQueryData(['posts', activeView.type, user?.id], (old) => {
                return old ? old.filter(post => post.idPost !== idPost) : [];
            });

            return { previousPosts }
        },

        onError: (err, idPost, context) => {
            // Si el backend falla, restauramos el post eliminado
            queryClient.setQueryData(['posts', activeView.type, user?.id], context.previousPosts);
            alert("No se pudo eliminar el post. Intentelo de nuevo.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', activeView.type, user?.id] });
        }
    });

   

    return(
        <div className="card border-0 post text-light me-2">
            <div className="card-header border-light d-flex justify-content-between align-items-center">
                { 
                    isOnEdit ? 
                        <input className="form-control" type="text" value={PostData?.titulo}/> : <h3>{PostData?.titulo}</h3> 
                }
              
                <small>{PostData?.remitente} {fechaFormateada}</small>
            </div>
            
            <div className="card-body">
                {
                    isOnEdit ? 
                        <textarea className="form-control" name="" id="" value={PostData?.contenido}></textarea> :
                        <p>{PostData?.contenido}</p>
                }

                <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                    {
                        PostData?.stringfiles !== '' && 
                            fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) 
                    }   
                </div>
            </div>

            <div className="card-footer border-top-light d-flex gap-2">
                <button className="btn btn-outline-light border-0 btn-sm"
                    onClick={() => likeMutation.mutate(PostData?.idPost)}>
                     <i className="bi bi-check-circle text-success fs-4"/> {PostData?.likes}
                </button>
                
                <button className="btn btn-outline-light border-0 btn-sm" disabled={activeView.type === 'comment'}
                onClick={() => setActiveView({type: 'comment', postTarget: Object.values(PostData)})} >
                    <i className="bi bi-chat fs-4"/> {PostData?.comentarios}      
                </button>
                    
                {
                     isMyPost &&   
                        (<button className="btn btn-outline-light border-0 btn-sm"
                         onClick={() => setIsOnEdit(!isOnEdit)}>
                            <i className="bi bi-pencil-fill fs-4"/>      
                        </button>)
                }

                {
                    isManageEnabled &&   
                        (<button className="btn btn-outline-light border-0 btn-sm"
                            onClick={() => deleteMutation.mutate([PostData?.idPost, PostData?.stringfiles])}>
                            <i className="bi bi-dash-circle text-danger fs-4"/>      
                        </button>)
                }
            </div>
        </div>
    )
}

export default Post;