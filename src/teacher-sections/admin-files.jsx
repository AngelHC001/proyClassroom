import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation, Mutation } from "@tanstack/react-query";

import { useAuth } from "../genUser-sections/AuthContext";
import { useView } from "../components/viewContext";

import SectionHeader from "../components/section-header";
import DisplayError from "../components/error_banner";
import LoadingSpinner from "../components/loading_spinner";
import NoDataYet from '../assets/no-data-yet.webp';

const APP_FOLDER = './appUploads/';
const API_URL = import.meta.env.VITE_API_URL;

function FileContainer({filesData}){
    const { user } = useAuth();
    const { activeView } = useView();
    const queryClient = useQueryClient(); 

    const filechain = filesData?.STRINGFILES.split('-');
    //MODES - FROMPOST/FROMCOMMENT

    const deleteFileMutation = useMutation({
        mutationFn: async([idPost, stringPost]) => {
            if(!confirm('¿Borrar archivos de este post?')) return;
            
            const response = await fetch(`${API_URL}/teacher/erase_files`,
                {
                    method:'DELETE',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({idPost: idPost, stringTarget: stringPost, mode:'fromPost'})                    
                });

            if(!response.ok) throw new Error('Error al procesar borrar archivo');
            return response.json();
        }, 
        onSuccess: async() => {
            queryClient.invalidateQueries({ queryKey: ['manage_files', activeView.type, user?.id] });
        }
    });


    return(
       <div className="col">
            <div className="card left-side border-0">
              
                <img className="card-img-top img-fluid rounded admin-file-preview" 
                src={`${APP_FOLDER}/${filechain[0]}`}/> 
                
                <ul className="list-group list-group-flush text-center">
                    <li className="list-group-item">{filechain.length} Imagen(es)</li>
                    <li className="list-group-item">Post: {filesData?.TITULO}</li>
                    <li className="list-group-item">De: {filesData?.REMITENTE}</li>
                    <li className="list-group-item">{filesData?.FECHAHORA}</li>
                </ul>
                            
                <div className="card-footer flex-row text-center">
                    <a className="btn btn-primary me-2">
                        <i className="bi bi-download"/>
                    </a>
                            
                    <button className="btn btn-danger" onClick={() => 
                        deleteFileMutation.mutate([filesData?.IDPOST, filesData?.STRINGFILES])}>
                        <i className="bi bi-trash-fill"/>
                    </button>                
                </div>
            </div>
        </div>
    )
}



function AdminFiles(){
    const { user } = useAuth();
    const { activeView } = useView();
        
    const mode = 0;

    const { data, isPending, isError } = useQuery({
        queryKey: ['manage_files', activeView?.type, user?.id],

        queryFn: async() => {
            const controller = new AbortController();
            const response = await fetch(`${API_URL}/teacher/fetch_files/${mode}`, 
                {
                    method:'GET',
                    signal: controller.signal
                });
            
            if(!response.ok)
                throw new Error('OCURRIO UN ERROR AL CONSULTAR ARCHIVOS (ADMIN)');

            return response.json();
        }, 
        enabled: !!user?.id
    });

    return(
        <div className="text-light">
            <SectionHeader title={'Archivos Enviados'} iconClass={'file-zip-fill'}/>

            <div className="post-space row row-cols-1 row-cols-3 g-2 p-2 z-2">
                {isError && <DisplayError/>}
                {isPending && <LoadingSpinner/>}
                
                { data?.length === 0 && 
                    <div className="text-center">
                        <img className="img-fluid" src={NoDataYet} width={80} height={80} alt="Sin datos"/>
                        <h3>Nadie subio nada todavia...</h3>
                    </div>
                }

                { data?.length > 0 && 
                    data?.map((filePack) => (
                        <FileContainer key={filePack?.IDPOST} filesData={filePack}/>       
                    )) 
                }  
                <br />
                <br />
            </div>
        </div> 
    )
}

export default AdminFiles;