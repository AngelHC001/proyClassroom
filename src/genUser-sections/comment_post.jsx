import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import Post from "../components/post-template";
import Comment from "../components/postComment-template";
import LoadingSpinner from '../components/loading_spinner'
import DisplayError from '../components/error_banner'

import NoCommentYet from '../assets/no-comment-yet.webp'; 

const APIURL = import.meta.env.VITE_API_URL; 
const keys = ["idPost", "titulo", "contenido", "fechahora","stringfiles", "likes", 
                    "comentarios", "remitente", "idUsuario"];
    
function CommentPost(){
    const { user } = useAuth();
    const { activeView, setActiveView } = useView();
    
    //CONVERSION A OBJETO
    const values = activeView.postTarget;
    if (keys.length !== values.length) {
        throw new Error("Los arrays de claves y valores no tienen la misma longitud");
    }

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
            <SectionHeader title={'Ver Publicacion'} iconClass={'sticky'}>
                <button className="btn btn-outline-dark" onClick={() => setActiveView({type: 'feed'})}>
                    <i className="bi bi-arrow-left"/> Volver
                </button>
            </SectionHeader>
            
            <div className="post-space p-3">
                <Post PostData={obj}/>

                <div className="d-flex flex-column gap-1">
                    { isError && <DisplayError/> }
                    { isPending && <LoadingSpinner/>}

                    { data?.length === 0 && 
                            (<div className="text-center p-3">
                                <img className="img-fluid rounded" src={NoCommentYet} width={80} height={80} alt="Sin datos"/>
                                <h3>Inicia la Conversacion!</h3>
                            </div>)
                    }

                    { 
                        data?.length > 0 && data?.map(comment => (
                            <Comment key={comment?.idComentario} CommentData={comment}/> )) 
                    }
                    <br/>
                </div>
            </div>

        </div>   
    ) 
}

export default CommentPost;