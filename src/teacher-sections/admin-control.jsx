import React from "react";

function AdminControl(){
    return(
        <div className="container-fluid">
              
            <div id="rightbar" className="col-md-8 text-light text-center bg-secondary">
                <div className="row p-1 bg-dark rounded">
                    <h2>Administradores</h2>
                </div>

                <table className="table table-bordered mt-1">
                    <tr className="table-active">
                        <th>Nombre</th>
                        <th>Matricula</th>
                        <th>Respuestas</th>
                        <th>Opciones</th>
                    </tr>    
                
    
                    <tr>
                        <td> echo $row[1]; </td>
                        <td> echo $row[2]; </td>
                        <td> echo $row[3]; </td>
                        <td>
    
                        <form action="" method="post">
                            <button name="delete_user" class="btn btn-sm btn-danger" 
                                    value="<?php echo $row[0]; ?>" title="Borrar">
                                <i class="bi bi-dash-circle-fill"></i>
                            </button>
                        </form>
                            
                    </td>
                </tr>
                          
                <tr>
                    <th colspan="4">Nuevo Administrador</th>
                </tr>

                    <tr>
                        <td colspan="4">
                            <form action="" method="post">
                                <div className="input-group mb-3">
                                    <input name="aNombre" className="form-control" type="text" placeholder="Nombre" required/>
                                    <input name="aMatricula" className="form-control" type="text" placeholder="Matricula" required/>
                                    <input name="aPass1" className="form-control" type="password" placeholder="Contraseña" required/>
                                    <input name="aPass2" className="form-control" type="password" placeholder="Confirma Contraseña" required/>
                                </div>
                                <button name="nuevoAdmin" class="btn btn-primary btn-lg" type="submit">Registrar</button>                   
                            </form>
                            
                        </td>
                    </tr>
                </table>    
            </div>
           
        </div>
    )
}

export default AdminControl;