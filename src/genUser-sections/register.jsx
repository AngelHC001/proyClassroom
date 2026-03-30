import React from "react";
import { Link } from "react-router-dom";
import LoginContainer from "../components/center_container";

function Register(){
    return(
        <LoginContainer> 
            <div className="card border-0 text-center">
                <div className="card-header bg-primary text-light">
                    <h3>Registro al grupo</h3>
                </div>
             
                <form className="p-3">
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2"  htmlFor="nombre">Nombre:</label>
                        <input className="form-control" type="text" name="nombre" required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="matricula">Matricula:</label>
                        <input className="form-control" type="text" name="matricula" required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="pass1">Contraseña:</label>
                        <input className="form-control" name="pass1" type="password" required/>
                    </div>
                    
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" for="pass2">Confirmar Contraseña:</label>
                        <input className="form-control" name="pass2" type="password" required/>
                    </div>

                    <button className="btn btn-primary" type="submit">Registrarse</button>
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