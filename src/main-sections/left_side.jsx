import React from "react";


import defaultImg from '../assets/user.png';


function ProfileArea(){
    return(
        <div className="row text-center">   
            <div className="col border-end">
                <h3>$userName </h3>
                <img className="rounded" src={defaultImg} width="80" height="80" alt="$userProf" />
                <p>$userMatricula</p>
            </div>

            <div className="col d-flex align-items-center justify-content-center">
                <form className="mt-3">    
                    <button className="btn btn-success mb-2" type="submit" formaction="user_pages/my_posts.php">
                        <i className="bi bi-sticky-fill"></i> Mis Posts
                    </button>

                    <button className="btn btn-secondary" type="submit"  formaction="user_pages/profile.php"> 
                        <i className="bi bi-pencil-square"></i> Editar Perfil
                    </button>

                    <button className="btn btn-danger mt-2" type="submit" formaction="utils/close.php">
                        <i className="bi bi-box-arrow-left"></i> Cerrar Sesion
                    </button>
                </form>      
            </div>     
        </div>    
    )
}


function PostArea(){
    return(
        <div class="row">
            <h5>Publicar</h5>
            
            <div class="col mb-3">
                <form action="" method="post" enctype="multipart/form-data">
                    <input name="titulo" class="form-control mb-2" type="text" placeholder="Titulo"/>
                    <textarea name="contenido" class="form-control" placeholder="Escribe algo..."></textarea>   
                        
                    <div id="archivos"></div>
                    
                    <div class="mt-2 text-end"> 
                        <button class="btn btn-outline-secondary" title="Retirar Archivos" onclick="cancelaArchivos()">
                            <i class="bi bi-x-square"></i> 
                        </button>
                                
                        <label class="btn btn-outline-secondary">
                            <i class="bi bi-paperclip"></i>    
                            <input id="fichero" name="archivo[]" type="file" multiple title="Adjuntar Archivo"/>
                        </label>
    
                        <button class="btn btn-outline-primary" type="submit"  title="Enviar" name="btnPost">
                            <i class="bi bi-send"></i>
                        </button>
                    </div> 
                </form>
            </div>

        </div>  
    )
}


function LeftSide(){
    return(
        <div className="col-md-4">
            <ProfileArea/>
            <PostArea/>
        </div>
    )
}

export default LeftSide;

