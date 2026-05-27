import React, {useContext, useState} from "react"
import { useView, ViewContext } from "../components/viewContext";
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


function AdminLeftBar(){
    const { activeView, setActiveView } = useView();
    

    return(
        <div className="col-md-4 left-side text-center p-3">
            <h2 className="display-6">Administrar Clase</h2>
            <hr />
               
            <div className="d-flex flex-column gap-2">
                {
                    db_items?.map((x) => (
                        <button key={x.key} className={`btn ${x.piece === activeView.type ? 'btn-dark': 'btn-outline-dark'}`} 
                            onClick={() => setActiveView({type: x.piece})}>  
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

function AdminRightBar(){
    const { activeView } = useContext(ViewContext);
    const [refreshKey,setRefreshKey] = useState(0);
    return(

        <div className="col-md-8 right-side">
            {activeView.type === 'users_control' &&  <AdminControl refreshKey={refreshKey} 
                                                onRefresh={() => setRefreshKey(k =>  k + 1)}/>}
            {activeView.type === 'my_profile' && <EditSection/>}
            {activeView.type === 'manage_posts' && <PostContainer/>}
            {activeView.type === 'manage_files' && <AdminFiles/>} 
        </div>
    )
}

function AdminSection(){
    const [activeView, setActiveView] = useState({type: 'my_profile'});
   
    return(
        <ViewContext.Provider value={{activeView, setActiveView}}>
            <div className="container-fluid">
                <div className="row">
                    <AdminLeftBar/>
                    <AdminRightBar/>
                </div>
            </div>
        </ViewContext.Provider>
    )    
}

export default AdminSection;