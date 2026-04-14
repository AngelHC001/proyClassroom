import React from "react";

function AdminFiles(){
    return(
         
            <div id="rightbar" className="col-md-8 text-light text-center">
                <div className="row p-2 bg-dark rounded text-between">
                    <h2>Archivos Enviados</h2>
                    
                </div>

                <div className="row p-2 admin-col-2">
                    
                <div className="col-sm-4 p-2">
                    <div className="card">
                        <div className="card-header">
                          
                        <img className="card-img-top" src="<?php echo $dir1;?>" width="287" height="160"/>
                                   
                </div>
                
                    <div className="card-body">
                        
                    </div>

                    <div className="card-footer">
                        <form action="" method="post">
                            <a className="btn btn-primary" href="<?php echo $dir1;?>" download="<?php echo $dir1;?>" >
                                Descargar
                            </a>
                            
                            <button name="delete" className="btn btn-danger" type="submit" value="<?php echo $dir1;?>" >
                                Borrar
                            </button>                
                        </form>
                    </div>

                </div>
            </div> 

                       
        </div>       
    </div> 
    )
}

export default AdminFiles;