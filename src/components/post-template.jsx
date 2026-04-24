import React from "react";
//import { useNavigate } from "react-router-dom";

/*
function FileContainer({filename}){
    return(
        <a href="#" download="#" >
            <img className="rounded" src="../assets/teacher1.jpg" width="80" height="80"/>
        </a>
    )
}*/


function Post({PostData, context, isManageEnabled = false}){
    //const navigate = useNavigate();
    //HANDLE LIKES
    //HANDLE COMMENT
    
    const handleDelete = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3000/api/posts/erase_post',{
                method:'DELETE',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ mode:context, postTarget: PostData}),
            });

            if(!response.ok){
                const data = await response.json();
                throw new Error(data.message); 
            }

        } catch (error) {
            console.error(error.message);
            alert(error);               
        }
    }

    
    //const filePreviews = [];
    //const fileChain = PostData?.stringfile !== '' ? PostData?.stringfile.split('-'): '';
    
    //fileChain.map((f) => filePreviews.push(
      //  <FileContainer key={`postfile${f.lenght}`} filename={f}/>
    //))

    return(
        <div className="card border-0 post text-light me-2">
            <div className="card-header border-light d-flex justify-content-between align-items-center">
                <h3>{PostData?.titulo}</h3>

                <small>{PostData?.remitente} {PostData?.fechahora}</small>
            </div>

            <div className="card-body">
                <p>{PostData?.contenido}</p>
                <div className="d-flex flex-row justify-content-center gap-2">
                    <small>sin archivos adjuntos</small>
                    { /*fileChain === '' ? <small>Sin archivos adjuntos</small> : filePreviews */} 
                </div>
            </div>

            <form className="card-footer border-light d-flex gap-2">
                <button className="btn btn-success border-0 btn-sm">
                     <i className="bi bi-check-circle"></i> {PostData?.likes}   
                </button>

                <button className="btn btn-outline-light btn-admin border-0 btn-sm">
                     <i className="bi bi-chat"></i> {PostData?.comentarios}      
                </button>

                {isManageEnabled ?  
                    <button className="btn btn-danger border-0 btn-sm" type="submit" onClick={handleDelete}>
                         <i className="bi bi-dash-circle-fill"></i>      
                    </button> :
                    ''
                }
            </form>
        </div>
    )
}

export default Post;