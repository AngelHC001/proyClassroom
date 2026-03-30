
function LoginContainer({children}){
    return(
        <div className="container-fluid bg1">
            <div className="text-center py-2">
                <h1 className="display-3">Classroom: Habilidades del Pensamiento</h1>
                <h3 className="display-6">Bienvenido</h3>
            </div>
            
            <div className="d-flex justify-content-center align-items-center">
                {children}
            </div>
        </div>
    )
}

export default LoginContainer