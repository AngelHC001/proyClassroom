import React, { useRef } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./AuthContext";
import { useView } from "../components/viewContext";

import Post from "../components/post-template";
import SectionHeader from "../components/section-header";
import LoadingSpinner from "../components/loading_spinner";
import DisplayError from "../components/error_banner"

import NoPostYet from '../assets/no-post-yet.webp';

const APIURL = import.meta.env.VITE_API_URL;

//LISTA TODOS LOS POSTS AJUSTAR SEGUN EL MODO
//MODOS:  ALL_POSTS, MY_POSTS, USER_POSTS
function PostContainer(){
    const { user } = useAuth();
    const { activeView } = useView();
    
    const label = activeView.type === 'my_posts' ? 'Mis Posts' : 'Actividad';
   
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
                { isError && <DisplayError/> } 
                { isPending && <LoadingSpinner/> } 

                { data?.length === 0 && 
                    (<div className="text-center py-5">
                        <img className="img-fluid rounded" src={NoPostYet} width="200" height="200" alt="Sin datos"/>
                        <h3>Todavia no hay nada...</h3>
                    </div>)
                }


                { data?.length > 0 && 
                    data?.map(post => (<Post key={post?.idPost} PostData={post} />)) }

                <div ref={bottomRef}></div>        
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;