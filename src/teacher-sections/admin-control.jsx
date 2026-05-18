import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SectionHeader from "../components/section-header";
import DisplayError from "../components/error_banner.jsx";
import LoadingSpinner from "../components/loading_spinner.jsx";
import { useAuth } from "../genUser-sections/AuthContext.jsx"
import {useView} from "../components/viewContext.jsx"


const APIURL = import.meta.env.VITE_API_URL; 

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

function UserDataContainer({userData, onDelete}){
    return(
        <tr>
            <td>{userData?.NOMBRE}</td>
            <td>{userData?.MATRICULA}</td>
            <td>{userData?.TIPOUSUARIO === 0 ? 'Alumno' : 'Administrador'}</td>
            <td>
                <button className="btn btn-sm btn-danger" type="submit" title="Borrar" 
                 onClick={() => onDelete(userData?.IDUSUARIO)}>
                    <i className="bi bi-dash-circle-fill"/>
                </button>
            </td>
        </tr>
    )
}

//FUNCION INSERT
function NewUser(){
    const { user } = useAuth();
    const { activeView } = useView();
    const queryClient = useQueryClient();

    const [newUser, setNewUser] = useState({nombre:'', mat:''})
    const [isAdmin, setIsAdmin] = useState(false);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setNewUser((prev) => ({...prev, [name]:value}))
    }

    const handleCheck = (e) => { setIsAdmin(e.target.checked); } 

    //MUTATION RELOAD
    const newUserMutation = useMutation({
        mutationFn: async (newUserData) => {
            const response = await fetch(`${APIURL}/teacher/register_user`,{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(newUserData) 
            });
            
            if(!response.ok){
                const errData = await response.json();
                throw new Error(errData.message);
            }

            return response.json();             
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['users_control', activeView.type, user?.id]});
            setNewUser({nombre:'', mat:''});
            alert('Usuario Registrado');
        },
        onError: (error) => {
            console.error("Error al registrar usuario:", error);
        }
    })
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        const userType = isAdmin ? 1 : 0;
        const packedData = {nombre: newUser.nombre, matricula: newUser.mat, tipo: userType}

        try{
            //HACER REQUEST
            newUserMutation.mutate(packedData);
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
    const { activeView } = useView();
    const queryClient = useQueryClient();

    //MUTATION DELETE
    const deleteMutation = useMutation({
        mutationFn: async(userId) => {
            if(!confirm('¿Eliminar este alumno del grupo?')){ return; }
            
            const response = await fetch(`${APIURL}/teacher/erase_user/${userId}`, { 
                method: 'DELETE' 
            });
      
            if (!response.ok) throw new Error('Error al borrar');
            return response.json();
        },
        onError: (error) => {
            console.error('ERROR admin handleDelete', error.message)
            alert('Error al borrar usuario');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users_control'] });
        }
    });


    //MUTATION GET
    const { data, isPending, isError} = useQuery({
            queryKey: ['users_control', activeView.type, user?.id],
            queryFn: async () => {
                const controller = new AbortController();
                const signal = controller.signal;

                 const response = await fetch(`${APIURL}/teacher/list_users`,{
                    method: 'GET',
                    headers:{'Accept': 'application/json'},
                    signal: signal
                });

                if(!response.ok){
                    const errs = await response.json(); 
                    throw new Error(errs.message);
                }
                return response.json();
            }, 
            enabled: !!user?.id
    });

    return(
        <div className="d-flex flex-column gap-2 text-light">
            <SectionHeader title={"Control de Usuarios"} iconClass={'people-fill'}/>
            <NewUser/>

            <div className="post-space">
                {isError && <DisplayError/>}
                {isPending && <LoadingSpinner/> } 
                        
                <table className="table table-bordered mt-1 text-center">
                    <tbody>
                        <TableHeaders/>
                        {
                            data?.map((u) => (u.IDUSUARIO !== user?.id &&
                                <UserDataContainer key={u.IDUSUARIO} 
                                userData={u} onDelete={() => deleteMutation.mutate(u?.IDUSUARIO)}/>))
                        }
                    </tbody>
                </table>
                
                <br/>
                <br/>
                <br/>    
            </div>
        </div>
    )
}

export default AdminControl;