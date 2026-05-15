import React from "react";
import { useState, useEffect } from "react";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import Post from "../components/post-template";
import Comment from "../components/postComment-template";
import LoadingSpinner from '../components/loading_spinner'
import DisplayError from '../components/error_banner'

const APIURL = import.meta.env.VITE_API_URL; 

function CommentPost(){
    const { activeView, setActiveView } = useView();
    const keys = ["idPost", "titulo", "contenido", "fechahora","stringfiles", "likes", 
                    "comentarios", "remitente", "idUsuario"];
    
    const values = activeView.postTarget;
    if (keys.length !== values.length) {
        throw new Error("Los arrays de claves y valores no tienen la misma longitud");
    }
    // Conversión a objeto
    const obj = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    
    //SECCION COMENTARIOS CARGA Y DESPLIEGUE
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    useEffect(()=>{    
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        
        const GetComments = async() => { 
            try{
                const response = await fetch(`${APIURL}/comments/fetch_comment/${values[0]}`,{
                    method:'GET',
                    signal: controller.signal
                });
                const results = await response.json();
                setComments(results);   
            } catch (error) {
                //ver si atrapa mensaje o lista vacia
                if (error.name === 'AbortError') return;
                setError(error);
                console.error(error.message);         
            }
            finally{
                setLoading(false);
            }
        }

        GetComments();
        return () => controller.abort();
    },[activeView.type,values]);

  
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
                    {
                        error ? <DisplayError/> :
                            loading ? <LoadingSpinner/> :
                                comments.map((c) => (
                                    <Comment key={c?.idComentario} CommentData={c} />
                                ))
                    }
                 </div>
            </div>
        </div>   
    ) 
}

export default CommentPost;