import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

import Post from "../components/post-template";
import SectionHeader from "../components/section-header";

//LISTA TODOS LOS POSTS AJUSTAR SEGUN EL MODO
//MODOS:  ALL_POSTS, MY_POSTS, USER_POSTS
function PostContainer({ mode }){
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scrollRef = useRef(null);

    const label = mode === 'my_posts' ? 'Mis Posts' : 'Actividad';
    const manageMode = (mode === 'my_posts') || mode === ('user_posts') ? true : false;

    useEffect(()=>{    
        const controller = new AbortController();

        const GetPosts = async() => { 
            try{
                const response = await fetch('http://localhost:3000/api/fetch_posts',{
                    method:'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ mode: mode, userData: user}),
                    signal: controller.signal
                });

                const results = await response.json();
                setData(results);   
                
            } catch (error) {
                if (error.name === 'AbortError') return;
                alert(error);               
            }
            finally{
                setLoading(false);
            }
        }

        if (scrollRef.current) {
            scrollRef.current.scrollBottom = scrollRef.current.scrollHeight;
        }
        GetPosts();
        return () => controller.abort(); 
    },[mode, user]);

    return(
        <div className="text-light" ref={scrollRef}>
            <SectionHeader title={label} iconClass={'journal-check'}/>
            <div className="post-space d-flex flex-column gap-2 p-2">
                {   loading ? <h1>CARGANDO</h1> :
                        data.map((p) => (
                            <Post key={p?.idPost} PostData={p} context={mode} isManageEnabled={manageMode}/>
                        )) 
                } 
                <br/>        
            </div>
        </div>
    )
}

export default PostContainer;