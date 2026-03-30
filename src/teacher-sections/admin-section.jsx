import React from "react"


//mis posts
//ver alumnos
//admin
//archivos enviados
//ver perfil
//volver

function AdminBar(){
    return(
         <div className="col-md-4 text-light bg-dark border-end-2">
                <div className="row border border-2 p-1">
                    <h3>Opciones</h3>
                </div>
            
                <div className="row list-group p-1">
                    <a href="admin_post.php" className="list-group-item list-group-item-action" aria-current="true">Mis Publicaciones</a>
                    <a href="admin_stud.php" className="list-group-item list-group-item-action">Publicaciones de Alumnos</a>
                    <a href="#" className="list-group-item list-group-item-action active">Ver Usuarios</a>
                    <a href="admin_control.php" className="list-group-item list-group-item-action">Administrador</a>
                    <a href="admin_files.php" className="list-group-item list-group-item-action">Archivos Enviados</a>
                    <a href="admin_prof.php" className="list-group-item list-group-item-action">Ver Perfil</a>
                    <a href="admin_main.php" className="list-group-item list-group-item-action">Volver al Grupo</a>
                </div>    

                <div className="row list-group p-3 d-grid gap-3">
                    <h3>Opciones para el Grupo</h3>
                    <form action="" method="post">
                        <button className="btn btn-success" name="export" type="submit">
                            <i className="bi bi-download"></i> Guardar Actividad
                        </button>
                        <button className="btn btn-danger" name="clean" type="submit">
                            <i className="bi bi-trash"></i> Limpiar Grupo
                        </button>
                    </form>
                    
                </div>
            </div>
    )
}

function AdminSection(){
    return(
        <div className="container-fluid">
            <div className="row">
                <AdminBar/>

            </div>
        </div>
    )    
}

export default AdminSection;