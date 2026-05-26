import React from "react";
import { useView } from "./viewContext";

import FileContainer from "./file_container";

const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24h
};


// En el botón de comentarios dentro de PostContainer
function Post({PostData, isManageEnabled = false, onLike, onDelete}){
    const {activeView, setActiveView} = useView(); 
    
    const fecha = new Date(PostData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    

    const fileChain = PostData?.stringfiles.split('-') ?? [];

    const handleLikeClick = (e) => {
        e.preventDefault();
        onLike(PostData?.idPost);
    }

    const handleDeleteClick = (e) => {
        e.preventDefault();
        if(confirm('Seguro que quieres borrar este Post?')){
            onDelete([PostData?.idPost, PostData?.stringfiles]);
        }
    }

    return(
        <div className="card border-0 post text-light me-2">
            <div className="card-header border-light d-flex justify-content-between align-items-center">
                <h3>{PostData?.titulo}</h3>
                <small>{PostData?.remitente} {fechaFormateada}</small>
            </div>
            
            <div className="card-body">
                <p>{PostData?.contenido}</p>
                <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                    {
                        PostData?.stringfiles !== '' ? 
                            fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) 
                            : <hr/>
                    }   
                </div>
            </div>

            <form className="card-footer border-top-light d-flex gap-2">
                <button className="btn btn-outline-light border-0 btn-sm"
                    onClick={handleLikeClick}>
                     <i className="bi bi-check-circle text-success fs-4"/> {PostData?.likes}
                </button>
                
                <button className="btn btn-outline-light border-0 btn-sm" disabled={activeView.type === 'comment'}
                onClick={() => setActiveView({type: 'comment', postTarget: Object.values(PostData)})} >
                    <i className="bi bi-chat fs-4"/> {PostData?.comentarios}      
                </button>
                    

                {isManageEnabled &&   
                    (<button className="btn btn-outline-light border-0 btn-sm"
                        onClick={handleDeleteClick}>
                         <i className="bi bi-dash-circle text-danger fs-4"/>      
                    </button>)
                }
            </form>
        </div>
    )
}

export default Post;