import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginContainer from "../components/center_container";

import {useAuth} from "./AuthContext.jsx"


async function OperationLogin(sendData) {
    try{
        const response = await fetch('http://localhost:3000/api/login', {
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
        navigate("/")    //redirige al dashboard
    }

    return(
        <LoginContainer>
            <div className="card border-0 h-50 text-center">
                <div className="card-header bg-primary text-light">
                    <h3>Iniciar Sesión</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-3">
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="mat">Matricula:</label>
                        <input className="form-control" type="text" name="mat" 
                        value={formData.mat} onChange={handleChange} required/>
                    </div>

                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="pass">Contraseña:</label>
                        <input className="form-control" name="pass" type="password" 
                        value={formData.pass} onChange={handleChange} required/>
                    </div>

                    <button className="btn btn-primary" type="submit">Entrar</button>
                </form>

                <div className="card-footer">
                    <small>
                        <span>¿No tienes una cuenta? <Link to={"/register"}>Click Aqui</Link></span>
                    </small>
                    
                </div>
            </div>
        </LoginContainer>
       
    )
}

export default Login