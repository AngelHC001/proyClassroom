import React from "react";
import { useState, useEffect } from "react";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import Post from "../components/post-template";

function CommentPost(){
    const { activeView, setActiveView } = useView();
    const keys = ["idPost", "titulo", "contenido", 
                    "fechahora","stringfiles", "likes", "comentarios", "remitente", "idUsuario"];
    const values = activeView.postTarget;

    //console.log(values)
    // Validación: ambos arrays deben tener la misma longitud
    if (keys.length !== values.length) {
        throw new Error("Los arrays de claves y valores no tienen la misma longitud");
    }

    // Conversión a objeto
    const obj = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    return(
        <div className="container-fluid text-light">
            <SectionHeader title={'Ver Publicacion'} iconClass={'sticky'}/>

            <div className="p-2 post-space">
                <button className="btn btn-outline-dark mb-3" 
                    onClick={() => setActiveView({type: 'feed'})}>
                    <i className="bi bi-arrow-left"/> Volver
                </button>

                <Post PostData={obj}/>

                <div className="d-flex flex-column">
                    <div className="rounded p-2 border-bottom bg-dark">
                        <div className="d-flex justify-content-between border-bottom">
                            <span>TR-000 Kitachan</span>
                            <span>DD/MM/YYYY 11:11am</span>
                        </div>
                     
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Consectetur commodi officia, culpa assumenda beatae corporis 
                        dignissimos explicabo sapiente </p>
                    </div>
                </div>
                
            </div>
        </div>   
    ) 
}

export default CommentPost;