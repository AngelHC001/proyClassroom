import React from "react";
import { useState, useEffect,useRef } from "react";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import Post from "../components/post-template";
import Comment from "../components/postComment-template";

const APIURL = import.meta.env.APIURL; 

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
    const bottomRef = useRef(null);
    
    /*
    useEffect(()=>{    
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        
        const GetComments = async() => { 
            try{
                const response = await fetch(`${APIURL}/posts/fetch_comments`,{
                    method:'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ mode: activeView.type, userData: user}),
                    signal: controller.signal
                });
                const results = await response.json();
                setData(results);   
                
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

        GetPosts();
        return () => controller.abort();
    },[activeView.type, user]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data]);
    */




    
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
                    <Comment/>
                 </div>
            </div>
        </div>   
    ) 
}

export default CommentPost;