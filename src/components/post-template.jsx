import React from "react";


function FileContainer({filename}){
    return(
        <a href="#" download="#" >
            <img className="rounded" src="../assets/teacher1.jpg" width="80" height="80"/>
        </a>
    )
}

//Que tiene un Post
//-Titulo
//-Usuario (mat y nombre)
//-Fecha y Hora
//-Contenido
//-Cadena de nombres de archivos
//-Numero de Likes
//-Numero de comentarios

//pertenece a un usuario


function Post({PostData}){

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

            <div className="card-footer border-light d-flex gap-2">
                <button className="btn btn-success border-0 btn-sm">
                     <i className="bi bi-check-circle"></i> {PostData?.likes}   
                </button>

                 <button className="btn btn-dark border-0 btn-sm">
                     <i className="bi bi-chat"></i> {PostData?.comentarios}      
                </button>
            </div>
        </div>
    )
}

export default Post;