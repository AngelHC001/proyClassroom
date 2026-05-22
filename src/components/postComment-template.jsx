import React from "react";

const opciones = {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // formato 24h
};

function Comment({CommentData, isForManage = false}){
    

    const fecha = new Date(CommentData?.fechahora);
    const fechaFormateada = new Intl.DateTimeFormat("es-Mx", opciones).format(fecha);
    
    
    return(

        <div className="rounded p-2 border-bottom bg-dark">
            <div className="d-flex justify-content-between border-bottom">
                <span>{CommentData?.remitente}</span>
                <span>{fechaFormateada}</span>
            </div>
            
            <p>{CommentData?.contenido}</p>
            
            {
                isForManage && 
                <button className="p-auto btn btn-outline-danger border-0">
                    <i className="bi bi-dash-circle"></i>
                </button>
            }
           
        </div>
    )
}

export default Comment;