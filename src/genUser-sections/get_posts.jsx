import React, { useRef } from "react";
import { useState, useEffect } from "react";

import { useAuth } from "./AuthContext";
import { useView } from "../components/viewContext";

import Post from "../components/post-template";
import SectionHeader from "../components/section-header";
import LoadingSpinner from "../components/loading_spinner";
import DisplayError from "../components/error_banner"

const APIURL = import.meta.env.VITE_API_URL;


//HANDLE onLike
const handleLike = async(e, postId) => {
    e.preventDefault();
    try{
        await fetch(`${APIURL}/posts/like_post/${postId}`, { method:'POST' });
    } catch (error) {
        console.error(error.message);
    }
}


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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const bottomRef = useRef(null);
    
    const label = activeView.type === 'my_posts' ? 'Mis Posts' : 'Actividad';
    const manageMode = (activeView.type === 'my_posts') || (activeView.type === 'user_posts') ? true : false;

    useEffect(()=>{    
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        
        const GetPosts = async() => { 
            try{
                const response = await fetch(`${APIURL}/posts/fetch_posts`,{
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

    return(
        <div className="text-light">
            <SectionHeader title={label} iconClass={'journal-check'}/>
            <div className="post-space d-flex flex-column gap-2 p-2">
                {
                    error ? <DisplayError/> 
                    : 
                    loading ? <LoadingSpinner/> 
                        :
                        data.map((p) => (<Post key={p?.idPost} PostData={p} 
                            isManageEnabled={manageMode} 
                            onLike={handleLike}
                            onDelete={handleDelete}/>
                        )) 
                } 
                <div ref={bottomRef} ></div>
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;