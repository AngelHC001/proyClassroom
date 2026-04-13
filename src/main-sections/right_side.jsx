import React from "react";

/* 
 <?php //MOTOR DEL AREA DE PUBLICACIONES 
$queryPost = "SELECT * FROM PUBLICACION";     //TODAS LAS PUBLICACIONES            
$res = mysqli_query($conn,$queryPost);
if($res)
{
    while (($row = mysqli_fetch_array($res)) != NULL) //OBTENER REGLONES DE LAS CONSULTAS
    {       
        //PAUSA PHP?>
*/

import EditSection from "../genUser-sections/edit_profile";
import Post from "../components/post-template";


function PostContainer(){
    return(
        <div className="d-flex flex-column gap-2">
            <div className="row border-bottom">
                <h2 className="display-6 text-light">Actividad</h2>
            </div>

            <Post/>
        </div>
    )
}

function RightSide({activeView = ''}){
    //posts
    //my_posts
    //my_profile
    
    return(
        <div className="container-fluid ">
            {activeView === 'posts' &&  <PostContainer/>}
            {activeView === 'my_posts' &&  <h1>MIS POSTS COMPONENT</h1>}
            {activeView === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;