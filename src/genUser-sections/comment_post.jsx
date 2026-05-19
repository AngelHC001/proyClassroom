import React from "react";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import Post from "../components/post-template";
import Comment from "../components/postComment-template";
import LoadingSpinner from '../components/loading_spinner'
import DisplayError from '../components/error_banner'
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

const APIURL = import.meta.env.VITE_API_URL; 

function CommentPost(){
    const { user } = useAuth();
    const { activeView, setActiveView } = useView();
    const keys = ["idPost", "titulo", "contenido", "fechahora","stringfiles", "likes", 
                    "comentarios", "remitente", "idUsuario"];
    
    const values = activeView.postTarget;
    if (keys.length !== values.length) {
        throw new Error("Los arrays de claves y valores no tienen la misma longitud");
    }
    // Conversión a objeto
    const obj = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    
       
    //FETCH COMMENTS DEL POST ELEGIDO
    const {data, isPending, isError} = useQuery({
        queryKey:['posts', activeView.type, user?.id],
        
        queryFn: async() => {
            const controller = new AbortController();    
            const response = await fetch(`${APIURL}/comments/fetch_comment/${values[0]}`,{
                method:'GET',
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error('Error en la red');
            }

            return response.json();
        },
        enabled: !!obj?.idPost
    });
    
    return(
        <div className="container-fluid text-light">
            <SectionHeader title={'Ver Publicacion'} iconClass={'sticky'}/>

            <div className="p-2 post-space">
                <button className="btn btn-outline-dark mb-3" 
                    onClick={() => setActiveView({type: 'feed'})}>
                    <i className="bi bi-arrow-left"/> Volver
                </button>

                <Post PostData={obj}/>

                 <div className="d-flex flex-column">
                    { isError && <DisplayError/> }
                    { isPending && <LoadingSpinner/>}
                    { data?.map(comment => (<Comment key={comment?.idComentario} CommentData={comment}/>)) }
                 </div>
            </div>
        </div>   
    ) 
}

export default CommentPost;