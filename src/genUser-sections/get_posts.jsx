import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

import Post from "../components/post-template";
import SectionHeader from "../components/section-header";
import LoadingSpinner from "../components/loading_spinner";
import DisplayError from "../components/error_banner";

//LISTA TODOS LOS POSTS AJUSTAR SEGUN EL MODO
//MODOS:  ALL_POSTS, MY_POSTS, USER_POSTS
function PostContainer({ mode, refreshKey }){
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const bottomRef = useRef(null);
    
    const label = mode === 'my_posts' ? 'Mis Posts' : 'Actividad';
    const manageMode = (mode === 'my_posts') || mode === ('user_posts') ? true : false;

    useEffect(()=>{    
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        

        const GetPosts = async() => { 
            try{
                const response = await fetch('http://localhost:3000/api/posts/fetch_posts',{
                    method:'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ mode: mode, userData: user}),
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
    },[mode, user, refreshKey]);

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
                    loading ? <LoadingSpinner/> :
                        data.map((p) => (<Post key={p?.idPost} PostData={p} context={mode} 
                            isManageEnabled={manageMode}/>)) 
                } 
                <div ref={bottomRef} ></div>
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;