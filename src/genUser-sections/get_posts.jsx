import React, { useRef } from "react";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "./AuthContext";
import { useView } from "../components/viewContext";

import Post from "../components/post-template";
import SectionHeader from "../components/section-header";
import LoadingSpinner from "../components/loading_spinner";
import DisplayError from "../components/error_banner"

const APIURL = import.meta.env.VITE_API_URL;

//LISTA TODOS LOS POSTS AJUSTAR SEGUN EL MODO
//MODOS:  ALL_POSTS, MY_POSTS, USER_POSTS
function PostContainer(){
    const { user } = useAuth();
    const { activeView } = useView();
    const queryClient = useQueryClient();
    
    const label = activeView.type === 'my_posts' ? 'Mis Posts' : 'Actividad';
    const manageMode = (activeView.type === 'my_posts') || (activeView.type === 'manage_posts');
    
    //FUNCION FETCH
    const { data, isPending, isError} = useQuery({
        queryKey: ['posts', activeView.type, user?.id],
        queryFn: async () => {
            const controller = new AbortController();

            const response = await fetch(`${APIURL}/posts/fetch_posts`,{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ mode: activeView.type, userData: user}),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error('Error en la red');
            }

            return response.json()
        }, 
        enabled: !!user?.id
    });

    //FUNCION ON DELETE
    const MutationDelete = useMutation({
        mutationFn: async ([postId, stringfiles]) => {
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

    //FUNCION ON LIKE
    const MutationLike = useMutation({
        mutationFn: async (idPost) => {
            const response = await fetch(`${APIURL}/posts/like_post/${idPost}`, 
                { method:'GET' });
            
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

    //CONTROLAR SCROLL AL MODIFICAR
    const bottomRef = useRef(0);

    useEffect(() => {

        if(!data){ return; }

        const hayNuevoPost = data?.lenght > bottomRef.current;
        if(hayNuevoPost){
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        //actualizar ref
        bottomRef.current = data?.lenght;
    }, [data]);
  
    return(
        <div className="text-light">
            <SectionHeader title={label} iconClass={'journal-check'}/>
            <div className="post-space d-flex flex-column gap-2 p-2">
                {isError && <DisplayError/>} 
                {isPending && <LoadingSpinner/>} 

                { data?.map(post => (<Post key={post?.idPost} PostData={post} 
                    isManageEnabled={manageMode} 
                    onLike={() => MutationLike.mutate(post?.idPost)}
                    onDelete={() => MutationDelete.mutate([post?.idPost, post?.stringfiles])}/>))
                }

                <div ref={bottomRef}></div>        
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;