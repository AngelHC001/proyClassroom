import React, {useState} from "react"
import { Link } from "react-router-dom";

import EditSection from "../genUser-sections/edit_profile";
import PostContainer from "../genUser-sections/get_posts";
import AdminControl from "./admin-control";
import AdminFiles from "./admin-files";

const db_items = [
    {
        key: 'admin_item0',
        icon: 'bi bi-people-fill',
        sectionName: 'Control de Usuarios',
        piece: 'users_control'
    },
     {
        key: 'admin_item1',
        icon: 'bi bi-person-circle',
        sectionName: 'Mi Perfil',
        piece: 'my_profile'
    },
    {
        key: 'admin_item2',
        icon: 'bi bi-sticky-fill',
        sectionName: 'Mis Posts',
        piece: 'my_posts'
    },
    {
        key: 'admin_item3',
        icon: 'bi bi-stickies-fill',
        sectionName: 'Post de Alumnos',
        piece: 'manage_posts'
    },
   
    {
        key: 'admin_item4',
        icon: 'bi bi-file-zip-fill',
        sectionName: 'Archivos Enviados',
        piece: 'manage_files'
    }, 
];


//use auth  para verificar el tipo ususario 1


function AdminLeftBar({setActiveView}){
    return(
        <div className="col-md-4 left-side text-center p-3">
            <h2 className="display-6">Administrar Clase</h2>
            <hr />
               
            <div className="d-flex flex-column gap-2">
                {
                    db_items.map((x) => (
                        <button key={x.key} className="btn btn-outline-dark" 
                            onClick={() => setActiveView(x.piece)}>  
                            <i className={x.icon}></i> {x.sectionName}
                        </button> 
                    ))
                }
               
                <Link className="btn btn-light" to="/"> 
                    <i className="bi bi-arrow-left-square"></i> Volver al Grupo
                </Link>
            </div>    

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

function AdminRightSide({activeView = ''}){
    return(
        <div className="col-md-8 right-side">
            {activeView === 'users_control' &&  <AdminControl/>}
            {activeView === 'my_profile' && <EditSection/>}
            {activeView === 'my_posts' &&  <PostContainer mode={'my_posts'}/>}
            {activeView === 'manage_posts' &&  <PostContainer mode={'user_posts'}/>}
            {activeView === 'manage_files' &&  <AdminFiles/>} 
        </div>
    )
}

function AdminSection(){
    const [activeView, setActiveView] = useState('my_profile');

    return(
        <div className="container-fluid">
            <div className="row">
                <AdminLeftBar activeView={activeView} setActiveView={setActiveView}/>
                <AdminRightSide activeView={activeView}/>
            </div>
        </div>
    )    
}

export default AdminSection;