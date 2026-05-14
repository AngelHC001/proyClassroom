import React from "react";

function Comment({CommentData}){
return(

        <div className="rounded p-2 border-bottom bg-dark">
            <div className="d-flex justify-content-between border-bottom">
                <span>TR-000 Kitachan</span>
                <span>DD/MM/YYYY 11:11am</span>
            </div>
            
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
            Consectetur commodi officia, culpa assumenda beatae corporis 
            dignissimos explicabo sapiente </p>
        </div>
    )
}

export default Comment;