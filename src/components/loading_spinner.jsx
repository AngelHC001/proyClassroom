import React from "react";

function LoadingSpinner(){
    return(
        <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    )
}

export default LoadingSpinner;