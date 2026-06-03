import React from "react"
const APP_PATH = '/appUploads/';

function Modal({filename}){
    return(
        <div className="modal fade" id={'modalShow'+filename} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content right-side border-0">
                    <div className="modal-header">
                        <h5 className="text-light">Archivos Enviados</h5>
                    </div>

                    <div className="modal-body text-center">
                        <img className="img-fluid rounded" src={APP_PATH + filename} 
                            width={200} height={200}/>
                    </div>
                    
                    <div className="modal-footer">
                        <span className="text-light">{filename}</span>

                        <button type="button" className="btn btn-outline-light border-0 rounded-circle" data-bs-dismiss="modal">
                            <i className="bi bi-x" />
                        </button>
                    
                        <a className="btn btn-outline-light border-0 rounded-circle" href={APP_PATH + filename} download={APP_PATH + filename}>
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
            <button type="button" className="btn border-0" data-bs-toggle="modal" data-bs-target={'#modalShow'+file}>
                <img className="img-fluid rounded" src={APP_PATH + file} width={120} height={120}/>
            </button>

            <Modal filename={file}/>
        </div>
    )
}