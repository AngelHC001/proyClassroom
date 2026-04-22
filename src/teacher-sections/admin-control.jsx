import React, { useEffect, useState } from "react";
import SectionHeader from "../components/section-header";
import { useAuth } from "../genUser-sections/AuthContext.jsx"

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

function UserDataContainer({name, mat, user_type}){
    return(
        <tr>
            <td>{name}</td>
            <td>{mat}</td>
            <td>{user_type === 0 ? 'Alumno' : 'Administrador'}</td>
            <td>
                <button className="btn btn-sm btn-danger" value="<?php echo $row[0]; ?>" title="Borrar">
                    <i className="bi bi-dash-circle-fill"></i>
                </button>
            </td>
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
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchUsers(){
            setLoading(true);
            setError(null);
            try{
                const response = await fetch('http://localhost:3000/api/teacher/list_users',{
                    method: 'GET',
                    headers:{'Accept': 'application/json'},
                    signal: signal
                });

                if(!response.ok){
                    const errs = await response.json(); 
                    throw new Error(errs.message);
                }

                const data = await response.json();
                setUsers(data);
            }
            catch(err){
                if (err.name !== "AbortError") { setError(err.message); }
                console.error('ALGO SALIO MAL', err.message)
            }
            finally{
                setLoading(false);
            }
        }
        
        fetchUsers();
        return () => {controller.abort();}
    },[]);

    return(
        <div className="d-flex flex-column gap-2 text-light">
            <SectionHeader title={"Control de Usuarios"} iconClass={'people-fill'}/>
            <NewUser/>

            <div className="post-space">
                 <table className="table table-bordered mt-1 text-center">
                    { 
                        error ? <thead>Ocurrio un error...</thead> :
                        <tbody>
                            <TableHeaders/>
                            {
                                loading ? <tr><td>CARGANDO</td></tr>:
                                users.map((u) => ( u.IDUSUARIO === user?.id ? '':
                                    <UserDataContainer key={u.IDUSUARIO} name={u.NOMBRE} 
                                    mat={u.MATRICULA} user_type={u.TIPOUSUARIO}/>))
                            }
                        </tbody>
                    }
                </table>
                <br/>
                <br/>
                <br/>    
            </div>
        </div>
    )
}

export default AdminControl;