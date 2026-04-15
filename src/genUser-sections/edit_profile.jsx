import React from "react";

import {useAuth} from './AuthContext.jsx'
import SectionHeader from "../components/section-header.jsx";

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
            <h1>{user?.nombre}</h1>      
            <img className="rounded mb-3" src={IMGPATH + user?.imgPerfil} width="150" height="150"/>
               
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
            <h1>Editar</h1>
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
        <div className="text-light">            
            <SectionHeader title={'Mi Perfil'} iconClass={'person-circle'}/>
            <div className="row d-flex align-items-center py-5">
                <ChangePic/>
                <ChangeData/>
            </div>
        </div>
    )
}

export default EditSection;