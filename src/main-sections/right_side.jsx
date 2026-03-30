import React from "react";

/* 
 <?php //MOTOR DEL AREA DE PUBLICACIONES 
$queryPost = "SELECT * FROM PUBLICACION";     //TODAS LAS PUBLICACIONES            
$res = mysqli_query($conn,$queryPost);
if($res)
{
    while (($row = mysqli_fetch_array($res)) != NULL) //OBTENER REGLONES DE LAS CONSULTAS
    {       
        //PAUSA PHP?>
                            

*/

function PostTemplate(){
    return(
        <div class="row p-2 admin-col-2 d-grid gap-2">
                                         
            <div class="container-sm border border-2 border-light rounded bg-dark">
                <div class="row p-auto border-bottom">
                    <div class="col-sm-4"> 
                        <h4> $row['titulo']</h4> 
                    </div>

                    <div class="col-sm-8"> 
                        <p class="text-end">
                           <b>$row['usuario']-  $row['fecha_hora']</b>
                        </p>
                    </div>
                </div>

                <div class="row">
                    <p>$row['contenido']</p>
                </div>
                                
                <div class="d-flex flex-row p-2 justify-content-center">
                    {/*php 
                        if($row['archivo'] != null)
                        {   
                            $fileStrings = $row['archivo'];    //cadena de strings de 1 a 5 archivos  
                            $cut = explode("-",$fileStrings); //partir cadena

                            foreach($cut as $f)
                            { 
                                $format = strtolower(substr($f, -3));
                                if(in_array($format,$images))
                                { ?>*/}
                    <div class="flex-column me-2 bg-light text-center rounded">
                        <a href="uploaded_files/<?php echo $f;?>" download="<?php echo $f;?>" >
                            <img class="rounded" src="uploaded_files/<?php echo $f;?>" width="80" height="80"/>
                        </a>
                    </div> 
                    {/*
                                <?php 
                                }
                                else
                                { ?>*/}
                    <div class="flex-column me-2 bg-light text-center rounded">
                        <a href="uploaded_files/<?php echo $f;?>" download="<?php echo $f;?>" >
                            {/*<?php echo $f?>*/}
                        </a>
                    </div>
                </div>
                
                <div class="p-2 border-top">
                    <form action="" method="get">
                        
                        <button class="btn btn-success btn-sm" name="btnLike">
                            <i class="bi bi-check-circle"></i>   
                        </button>
                        <span>#nlikes</span>

                        <button class="btn btn-primary btn-sm" name="btnComment">
                            <i class="bi bi-chat"></i>       
                        </button>
                        <span>comments</span>
                    </form>
                </div>
            </div> 
        </div>
    )

}




function RightSide(){
    return(
        <div className="col-md-8">
            <div class="row p-2 bg-dark rounded">
                <h2>Publicaciones</h2>
            </div>

            <PostTemplate/>

        </div>
    )
}

export default RightSide;