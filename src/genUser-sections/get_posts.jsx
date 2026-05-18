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


//HANDLE onDelete
const handleDelete = async(e, postId) => {
    e.preventDefault();
    if(!confirm('¿Borrar Publicacion?')){ return; }

    try{
        await fetch(`${APIURL}/posts/erase_post/${postId}`, { method:'DELETE' });
    } 
    catch (error) {
        console.error(error.message);
        alert('OCURRIO UN ERROR AL BORRAR');               
    }
}



//LISTA TODOS LOS POSTS AJUSTAR SEGUN EL MODO
//MODOS:  ALL_POSTS, MY_POSTS, USER_POSTS
function PostContainer(){
    const { user } = useAuth();
    const { activeView } = useView();
    const bottomRef = useRef(null);
    const controller = new AbortController();
    const queryClient = useQueryClient();
    
    const label = activeView.type === 'my_posts' ? 'Mis Posts' : 'Actividad';
    const manageMode = (activeView.type === 'my_posts') || (activeView.type === 'user_posts') ? true : false;
    
    const { data, isPending, isError} = useQuery({
        queryKey: ['posts', activeView.type, user?.id],
        queryFn: async () => {
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


    const MutationLike = useMutation({
        mutationFn: async (postId) => {
            const response = await fetch(`${APIURL}/posts/like_post/${postId}`, 
                { method:'GET' });
            return response.json();
        },
        //FUNCION AL DAR CLICK
        onMutate: async(postId) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            const previusPosts = await queryClient.getQueryData(['posts']);
        
            //actualizar cache
            queryClient.setQueryData(['posts'], (old) => {
                return old.map((post) =>
                    post.id === postId 
                    ? { ...post, likes: post.likes + 1, userLiked: true } 
                    : post
                );
            });
            
            return previusPosts;
        },

        onError: (err, postId, context) => {
            queryClient.setQueryData(['posts'], context.previousPosts);
            console.error("No se pudo dar like, revirtiendo...");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }      
    });


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                    onDelete={handleDelete}/>))
                }
            
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;