import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginContainer from "../components/center_container";

import {useAuth} from "./AuthContext.jsx"
const APIURL = import.meta.env.VITE_API_URL;

async function OperationLogin(sendData) {
    try{
        const response = await fetch(`${APIURL}/session/login`, {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(sendData)
        });
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Algo salio mal');
        }

        return await response.json();
    }catch(error){
        console.error('Error al registrar:', error.message);
        alert(`Hubo un problema: ${error.message}`);
    }
}

function Login(){
    const [formData, setformData] = useState({mat:'', pass:''});
    const { login } = useAuth();
    const navigate = useNavigate();


    const handleChange = (e) =>{
        const {name, value} = e.target;
        setformData((prev) => ({
          ...prev,
          [name]:value  
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await OperationLogin(formData);
        const userData =  response.usuario;
        
        login(userData); //guarda en contexto

        if(userData.tipoUsuario === 1)
            navigate('/admin-section');  //MODO ADMIN
        else
            navigate("/");               //NORMAL
    }

    return(
        <LoginContainer>
            <div className="card border-0 h-50 text-center">
                <div className="card-header btn-user text-light">
                    <h3>Iniciar Sesión</h3>
                </div>
                
                <form className="p-3 d-flex flex-column gap-2" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="col-form-label me-2" htmlFor="mat">Matricula:</label>
                        <input className="form-control" type="text" name="mat" 
                        value={formData.mat} onChange={handleChange} required/>
                    </div>

                    <div className="input-group">
                        <label className="col-form-label me-2" htmlFor="pass">Contraseña:</label>
                        <input className="form-control" name="pass" type="password" 
                        value={formData.pass} onChange={handleChange} required/>
                    </div>

                    <button className="btn border-0 btn-success btn-user" type="submit">Entrar</button>
                </form>
            </div>
        </LoginContainer>
       
    )
}

export default Login