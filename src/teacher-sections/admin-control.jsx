import React, { useEffect, useState } from "react";

import SectionHeader from "../components/section-header";
import DisplayError from "../components/error_banner.jsx";
import LoadingSpinner from "../components/loading_spinner.jsx";
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

function UserDataContainer({userId, name, mat, user_type}){

    const handleDelete = async(e) => {
        e.preventDefault();
        if(!confirm('¿Eliminar este alumno del grupo?')){
            return;
        }
    
        try {
                const response = await fetch('http://localhost:3000/api/teacher/erase_user',{
                method: 'DELETE',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({userTarget: userId})
            });
            
            if(!response.ok){
                const dataErr = await response.json();
                throw new Error(dataErr.message);
            }

            //Positivos
            alert('El Usuario ha sido eliminado');
            window.location.reload();

        } catch (error) {
            console.error('ERROR admin handleDelete', error.message)
            alert('Ocurrio un error al borrar');
        }
    }

    return(
        <tr>
            <td>{name}</td>
            <td>{mat}</td>
            <td>{user_type === 0 ? 'Alumno' : 'Administrador'}</td>
            <td>
                <form onSubmit={handleDelete}>
                    <button className="btn btn-sm btn-danger" type="submit" title="Borrar">
                        <i className="bi bi-dash-circle-fill"/>
                    </button>
                </form>
            </td>
        </tr>
    )
}

function NewUser(){
    const [newUser, setNewUser] = useState({nombre:'', mat:''})
    const [isAdmin, setIsAdmin] = useState(false);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]:value
        }))
    }

    const handleCheck = (e) => {
        setIsAdmin(e.target.checked);
    } 

    const handleSubmit = async(e) => {
        e.preventDefault();
        const userType = isAdmin ? 1 : 0;
        const packedData = {nombre: newUser.nombre, matricula: newUser.mat, tipo: userType}

        try{
            const response = await fetch('http://localhost:3000/api/teacher/register_user',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(packedData) 
            });

            if(!response.ok){
                const errData = await response.json();
                throw new Error(errData.message);
            }

            //Positivos
            setNewUser({nombre:'', mat:''});
            const data = await response.json();
            alert(data.message);
        }
        catch(error){
            console.error(error.message);
            alert('Ocurrio un error al insertar');
        }
    }
    
    return(
         <form onSubmit={handleSubmit} className="d-flex align-items-center flex-row gap-2">
            <h6>Nuevo Usuario</h6>
            <div className="input-group">
                <input className="form-control" name="nombre" type="text" 
                value={newUser.nombre} onChange={handleChange} placeholder="Nombre" required />
                
                <input className="form-control" name="mat" type="text" 
                value={newUser.mat} onChange={handleChange} placeholder="Matricula" required/>
            </div>

            <div className="form-check form-switch">
                <input className="form-check-input" name="tipo" type="checkbox"
                value={isAdmin} onChange={handleCheck}/>
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
                setError(err);
                if (err.name !== "AbortError") { return; }
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
                {
                    error ? <DisplayError/> :
                        loading ? <LoadingSpinner/> : 
                        <table className="table table-bordered mt-1 text-center">
                            <tbody>
                                <TableHeaders/>
                                {
                                    users.map((u) => (u.IDUSUARIO === user?.id ? '':
                                        <UserDataContainer key={u.IDUSUARIO} userId={u.IDUSUARIO} name={u.NOMBRE} 
                                        mat={u.MATRICULA} user_type={u.TIPOUSUARIO}/>))
                                }
                            </tbody>
                        </table>
                }
                <br/>
                <br/>
                <br/>    
            </div>
        </div>
    )
}

export default AdminControl;