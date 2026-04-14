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
import PostContainer from "../genUser-sections/get_posts";

function RightSide({activeView = ''}){
    //posts
    //my_posts
    //my_profile
    
    return(
        <div className="container-fluid ">
            {activeView === 'posts' && <PostContainer mode={'all_posts'}/> }
            {activeView === 'my_posts' &&  <PostContainer mode={'my_posts'}/>}
            {activeView === 'my_profile' && <EditSection/>}
        </div>
    )
}

export default RightSide;