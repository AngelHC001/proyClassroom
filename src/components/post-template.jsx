import React from "react";

/*
function FileContainer({filename}){
    return(
        <a href="#" download="#" >
            <img className="rounded" src="../assets/teacher1.jpg" width="80" height="80"/>
        </a>
    )
}*/


function Post({PostData, isManageEnabled = false, onLike, onComment, onDelete}){
   
    //const fileChain = PostData?.stringfile !== '' ? PostData?.stringfile.split('-'): [];

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

            <form className="card-footer border-top-light d-flex gap-2">
                <button className="btn btn-outline-light border-0 btn-sm">
                     <i className="bi bi-check-circle text-success fs-4"/> {PostData?.likes}
                </button>

                <button className="btn btn-outline-light border-0 btn-sm">
                     <i className="bi bi-chat fs-4"/> {PostData?.comentarios}      
                </button>

                {isManageEnabled ?  
                    <button className="btn btn-outline-light border-0 btn-sm"
                        onClick={(e) => onDelete(e, PostData?.idPost)}>
                         <i className="bi bi-dash-circle text-danger fs-4"/>      
                    </button> : ''
                }
            </form>
        </div>
    )
}

export default Post;