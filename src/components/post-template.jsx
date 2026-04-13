import React from "react";


function FileContainer(){
    return(
        <a href="#" download="#" >
            <img class="rounded" src="../assets/teacher1.jpg" width="80" height="80"/>
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
    return(
        <div className="card border-0 post text-light">
            <div className="card-header border-light d-flex justify-content-between align-items-center">
                <h4>--Titulo--</h4>
                <h6>--Usuario--FechaHora---</h6>
            </div>

            <div className="card-body">
                <p>--Contenido--</p>

                {/*has images?*/}
                <div className="d-flex flex-row justify-content-center gap-2">
                    <FileContainer/>
                </div>
            </div>

            <div className="card-footer border-light d-flex gap-2">
                <button className="btn btn-success border-0 btn-sm">
                     <i class="bi bi-check-circle"></i> 0   
                </button>

                 <button className="btn btn-dark border-0 btn-sm">
                     <i class="bi bi-chat"></i> 0      
                </button>
            </div>
        </div>
    )
}

export default Post;