import React from "react";
import { Link } from "react-router-dom";

import LoginContainer from "../components/center_container";

function Login(){
    return(
        <LoginContainer>
            <div className="card border-0 h-50 text-center">
                <div className="card-header bg-primary text-light">
                    <h3>Iniciar Sesión</h3>
                </div>

                <form className="p-3">
                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="matricula">Matricula:</label>
                        <input type="text" className="form-control" name="matricula" required/>
                    </div>

                    <div className="input-group mb-3">
                        <label className="col-form-label me-2" htmlFor="contraseña">Contraseña:</label>
                        <input name="contraseña" type="password" className="form-control" required/>
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

 /*
        <div className="container">
            <div className="row">

          

            <div className="card-signup mt-3">
                <div className="card text-center">
                    
                   
                    
                    <div className="card-body">
                        <form action="" method="post">
                            <div className="form-group row mb-3">
                                <label for="usuario" className="col-sm-2 col-form-label">Matricula:</label>
                                <div className="col-sm-10">
                                    <input name="matricula" type="text" className="form-control" required/>
                                </div>  
                            </div>

                            <div className="form-group row mb-3">
                                <label for="contraseña" className="col-sm-2 col-form-label">Contraseña:</label>
                                <div className="col-sm-10">
                                    <input name="contraseña" type="password" className="form-control" required/>
                                </div>
                            </div>

                            <input name="start" type="submit" className="btn btn-primary"/>
                        </form>
                    </div>

                  

                </div>
            </div>  

            </div> 
        </div> */

export default Login