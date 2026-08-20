import React from "react"

export default function ModalNotification({message}){
    return(
         <div className="modal fade" id="notification" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content right-side border-0">
                   
                    <div className="modal-body text-center">
                        {message}
                    </div>
                    
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-light btn-user" data-bs-dismiss="modal">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}