import React from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../components/section-header";


function CommentPost(){
    //const { id } = useParams();

    return(
        <div className="container-fluid">
            <SectionHeader title={'Ver Publicacion'} iconClass={'sticky'}/>
            
        </div>
       
    ) 
}

export default CommentPost;