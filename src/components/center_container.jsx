
function LoginContainer({children}){
    return(
        <div className="container-fluid bg1 text-center">
            
            <div className="right-side m-2 py-4 p-2 text-light rounded-pill border border-light border-3">
                <h1>Classroom: Habilidades del Pensamiento</h1>
                <h3 className="display-6">Bienvenido</h3>
            </div>
            
            <div className="d-flex justify-content-center align-items-center">
                {children}
            </div>

            <br />
            <small className="bg-light p-3 rounded">
                Nota: Las credenciales del modo administrador están disponibles bajo solicitud para evitar alteraciones en la base de datos de pruebas.
            </small>
        </div>
    )
}

export default LoginContainer