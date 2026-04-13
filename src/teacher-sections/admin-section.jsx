import React from "react"
import { Link } from "react-router-dom";

//use auth  para verificar el tipo ususario 1

//mis posts
//ver alumnos
//admin
//archivos enviados
//ver perfil
//volver
/*
 <a href="admin_post.php" className="list-group-item list-group-item-action" aria-current="true">Mis Posts</a>
                <a href="admin_stud.php" className="list-group-item list-group-item-action">Posts de Alumnos</a>
                <a href="#" className="list-group-item list-group-item-action active">Ver Alumnos</a>
                <a href="admin_control.php" className="list-group-item list-group-item-action">Administrador</a>
                <a href="admin_files.php" className="list-group-item list-group-item-action">Archivos Enviados</a>
                <a href="admin_prof.php" className="list-group-item list-group-item-action">Mi Perfil</a>
                <a href="admin_main.php" className="list-group-item list-group-item-action">Volver al Grupo</a> */

function AdminBar(){
    return(
         <div className="col-md-4 text-light text-center bg-dark p-3">
            <h2>Administrar Clase</h2>
               
            
            <ul className="list-group p-1">
                <li className="list-group-item">1</li>
                <li className="list-group-item">2</li>
                <li className="list-group-item">3</li>
                <li className="list-group-item">4</li>
                <li className="list-group-item">5</li>
                <li className="list-group-item">
                    <Link to="/"> Volver al Grupo</Link>
                </li>
            </ul>    

           
            <h3>Opciones para el Grupo</h3>
            <form className="d-flex justify-content-center gap-2">
                <button className="btn btn-success" name="export" type="submit">
                    <i className="bi bi-download"></i> Guardar Actividad
                </button>
                <button className="btn btn-danger" name="clean" type="submit">
                    <i className="bi bi-trash"></i> Limpiar Grupo
                </button>
            </form>
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