import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

import LoginContainer from "../components/center_container";
const APIURL = import.meta.env.VITE_API_URL;

async function OperationRegister(sendData) {
    try{
        const response = await fetch(`${APIURL}/register`, {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(sendData)
        });
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Algo salio mal');
        }

        const data = await response.json();
        return alert(data.message);
    }catch(error){
        console.error('Error al registrar:', error.message);
        alert(`Hubo un problema: ${error.message}`);
    }
}



function Register(){
    const [formData, setformData] = useState({nombre:'', matricula:''});
    const [passTrial, setpassTrial] = useState({pass1:'', pass2:''})

    const handleChange = (e) => {
        const {name, value} = e.target;

        if(name === 'pass1' || name === 'pass2'){
            setpassTrial((prev) => ({
                ...prev,
                [name]: value
            }));
        }
        else
        {
            setformData((prev) => ({
                ...prev,
                [name]: value
            }));
        }       
    }

    const ClearFields = () =>{
        setpassTrial({pass1:'',pass2:''});
        setformData({nombre:'',matricula:''});
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        //Validar las contraseñas
        const passMatch = passTrial.pass1 === passTrial.pass2;
        const passReal = passMatch ? passTrial.pass1 : '';

        if (!passMatch) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const packedData = {name: formData.nombre, mat: formData.matricula, pass: passReal};
        OperationRegister(packedData);
        ClearFields(); // Limpiar el formulario tras el éxito
    }

    return(
        <LoginContainer> 
            <div className="card border-0 text-center">
                <div className="card-header bg-primary text-light">
                    <h3>Registro al grupo</h3>
                </div>
             
                <form onSubmit={handleSubmit} className="p-3">
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="nombre">Nombre:</label>
                        <input className="form-control" type="text" name="nombre" 
                        value={formData.nombre} onChange={handleChange} required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="matricula">Matricula:</label>
                        <input className="form-control" type="text" name="matricula" 
                        value={formData.matricula} onChange={handleChange} required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="pass1">Contraseña:</label>
                        <input className="form-control" name="pass1" type="password" 
                        value={passTrial.pass1} onChange={handleChange} required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="pass2">Confirmar Contraseña:</label>
                        <input className="form-control" name="pass2" type="password" 
                        value={passTrial.pass2} onChange={handleChange} required/>
                    </div>

                    <div>
                        <button className="btn btn-primary me-1" type="submit">Registrarse</button>
                        <button className="btn btn-secondary" type="button" onClick={ClearFields}>Limpiar</button>
                    </div>

                </form>     
               
                <div className="card-footer">
                    <small>
                        <span>¿Ya tienes una cuenta? <Link to={'/login'}>Inicia Sesión</Link></span>
                    </small>
                </div>

            </div> 
        </LoginContainer>
    )
}

export default Register;