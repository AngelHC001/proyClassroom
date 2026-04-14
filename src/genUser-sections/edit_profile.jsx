import React from "react";

import {useAuth} from './AuthContext.jsx'

const IMGPATH = '../appUserData/';

//OPERATIONS
//change file profile
//change userData


function ChangePic(){
    const { user } = useAuth();
    //onSubmit
    //update file
    //handleChange

    return(
        <div className="col-md-6 border-end text-center">
            <h2>{user?.nombre}</h2>      
            <img className="rounded mb-2" src={IMGPATH + user?.imgPerfil} width="120" height="120"/>
               
            <form encType="multipart/form-data">
                <label className="btn btn-primary me-2">
                    <i className="bi bi-camera"></i> Cambiar Foto
                    <input id="fichero" type="file" name="subirFoto"/>
                </label>
                    
                <button className="btn btn-success" type="submit" name="btnSave">
                    <small><i className="bi bi-floppy"> </i>Guardar</small>
                </button>

                <div className="mb-3" id="archivos"></div>
            </form>

            <small>
                <i className="bi bi-info-circle"> </i> 
                Elige primero una foto y despues pulsa Guardar.
            </small>              
        </div>
    )
}

function ChangeData(){
    const { user } = useAuth();
    //submit
    //updateData
    //handleChange
    //confirm pass

    return(
        <div className="col-md-6">
            <h2>Editar</h2>
            <form className="d-flex flex-column gap-2" action="" method="post">
                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="name">Nombre:</label>
                    <input className="form-control" type="text" value={user?.nombre} name="name" required/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="matricula">Matricula:</label>
                    <input className="form-control" type="text" value={user?.matricula} name="matricula" required/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="pass1">Nueva Contraseña:</label>
                    <input  className="form-control" type="password" name="pass1"/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="pass2">Confirmar Contraseña:</label>
                    <input className="form-control" type="password" name="pass2"/>
                </div>

                <div className="mb-3 text-end">
                    <button className="btn btn-primary">
                        <i className="bi bi-pencil"></i> Cambiar datos
                    </button>
                </div>
            </form>
        </div>
    )
}



function EditSection(){
    return(
        <div className="d-flex justify-content-center align-items-center py-5">            
            <div className="row bg-secondary rounded">
                <h1>Mi Perfil</h1>
                <hr/>
                <ChangePic/>
                <ChangeData/>
            </div>
        </div>
    )
}

export default EditSection;