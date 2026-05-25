import React from "react";
import FileContainer from '../components/file_container.jsx';

const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24h
};

function Comment({CommentData, isForManage = false, isEditable = false}){
    const fecha = new Date(CommentData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    const fileChain = CommentData?.stringfiles.split('-') ?? [];


    return(
        <div className="rounded p-1 comment">
            <div className="d-flex justify-content-between border-bottom">
                <span>{CommentData?.remitente}</span>
                <span>{fechaFormateada}</span>
            </div>
            
            <p>{CommentData?.contenido}</p>

            <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                {
                    CommentData?.stringfiles && fileChain.map((f,i) => (<FileContainer key={i} file={f}/>)) 
                }   
            </div>
        
            {
               isEditable &&
                    <button className="btn btn-outline-light border-0 rounded-circle">
                        <i className="bi bi-pencil"/>
                    </button>
            }
 
            { 
                isForManage && 
                    <button className="btn btn-outline-light border-0 rounded-circle">
                        <i className="bi bi-dash-circle"/>
                    </button>   
            }
        </div>
    )
}

export default Comment;