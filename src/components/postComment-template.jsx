import React from "react";

function Comment({CommentData, isOwnActive = false}){
return(

        <div className="rounded p-2 border-bottom bg-dark">
            <div className="d-flex justify-content-between border-bottom">
                <span>{CommentData?.remitente}</span>
                <span>{CommentData?.fechahora}</span>
            </div>
            
            <p>{CommentData?.contenido}</p>
        
            {
                isOwnActive && 
                <button className="p-auto btn btn-outline-danger border-0">
                    <i className="bi bi-dash-circle"></i>
                </button>
            }
           
        </div>
    )
}

export default Comment;