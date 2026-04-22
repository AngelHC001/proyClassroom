import React from "react";
import SectionHeader from "../components/section-header";


function TableHeaders(){
    return(
        <tr className="table-active">
            <th>Nombre</th>
            <th>Matricula</th>
            <th>Tipo Usuario</th>
            <th>Opciones</th>
        </tr>    
    )
}

function NewUser(){
    return(
         <form className="d-flex align-items-center flex-row gap-2">
            <h6>Nuevo Usuario</h6>
            <div className="input-group">
                <input className="form-control" name="nombre" type="text" placeholder="Nombre" required/>
                <input className="form-control" name="matricula" type="text" placeholder="Matricula" required/>
            </div>

            <div className="form-check form-switch">
                <input className="form-check-input" name="tipo" type="checkbox"/>
                <label className="form-check-label" htmlFor="tipo">Administrador</label>
            </div>    
               
            <button className="btn btn-primary" type="submit">Registrar</button>                   
        </form>
    )
}


function AdminControl(){
    



    return(
        <div className="d-flex flex-column gap-2 text-light">
            <SectionHeader title={"Control de Usuarios"} iconClass={'people-fill'}/>
            <NewUser/>

            <table className="table table-bordered mt-1 text-center">
                <tbody>
                    <TableHeaders/>
                    <tr>
                        <td> echo $row[1]; </td>
                        <td> echo $row[2]; </td>
                        <td> echo $row[3]; </td>
                        <td>
                            <div className="form-check form-switch">
                                <input className="form-check-input" name="tipo" type="checkbox"/>
                                
                                <button className="btn btn-sm btn-danger" value="<?php echo $row[0]; ?>" title="Borrar">
                                    <i className="bi bi-dash-circle-fill"></i>
                                </button>
                            </div> 
                        </td>
                    </tr>
                </tbody>
            </table>    
        </div>
    )
}

export default AdminControl;