import React from "react"

const CLOUD_URL = import.meta.env.VITE_CLOUDINARY_URL;

function Modal({filename}){
    return(
        <div className="modal fade" id={'modalShow'+filename} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content right-side border-0">
                    <div className="modal-header">
                        <h5 className="text-light">Archivos Enviados</h5>
                    </div>

                    <div className="modal-body text-center">
                        <img className="img-fluid rounded" src={CLOUD_URL + filename} 
                            style={{ width: 250, height: 250, objectFit: "contain"}} />
                    </div>
                    
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-light border-0 rounded-circle" data-bs-dismiss="modal">
                            <i className="bi bi-x" />
                        </button>
                    
                        <a className="btn btn-outline-light border-0 rounded-circle" href={CLOUD_URL + filename} download={filename}>
                            <i className="bi bi-download"/>    
                        </a>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}        

export default function FileContainer({file}){
    return(
        <div>
            <button type="button" className="btn border-0" 
                data-bs-toggle="modal" data-bs-target={'#modalShow'+file}>
                <img className="img-fluid rounded" src={CLOUD_URL + file}
                    style={{ width: 180, height: 180, objectFit: "contain"}}/>
            </button>

            <Modal filename={file}/>
        </div>
    )
}