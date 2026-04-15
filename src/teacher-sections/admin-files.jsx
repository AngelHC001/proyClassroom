import React from "react";
import SectionHeader from "../components/section-header";

function FileContainer(){
    return(
        <div className="col">
            <div className="card left-side border-0">
                <div className="card-header">
                    <img className="card-img-top" src=""/>            
                </div>
 
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Enviado Por:</li>
                    <li className="list-group-item">Fecha:</li>
                </ul>
                          
                <form className="card-footer text-center">
                    <a className="btn btn-primary me-2" href="" download="" >
                        Descargar
                    </a>
                            
                    <button className="btn btn-danger" type="submit" value="" >
                        Borrar
                    </button>                
                </form>
            </div>
        </div>
    )
}



function AdminFiles(){
    return(
        <div className="text-light">
            <SectionHeader title={'Archivos Enviados'} iconClass={'file-zip-fill'}/>

            <div className="row gap-1 p-2">
                <FileContainer/>
                <FileContainer/>
                <FileContainer/>                
            </div>       
        </div> 
    )
}

export default AdminFiles;