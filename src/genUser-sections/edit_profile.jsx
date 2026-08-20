import React, {useState} from "react";
import {useAuth} from './AuthContext.jsx'
import SectionHeader from "../components/section-header.jsx";
import ModalNotification from "../components/modal_notif.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_URL = import.meta.env.VITE_CLOUDINARY_URL;

function ChangePic({setMessage}){
    const { user, updateUser } = useAuth();
    const [newImg, setNewImg] = useState(null);
    
    const clear = (e) => {e.target.value = null; setNewImg(null);}

    const handleFileChange = (e) => {
        const file = e.target.files[0]; 
        if (!file) {
            setNewImg(null);
            setMessage("No file selected.");
            return;
        }
        setNewImg(file);
        setMessage('');
    }
    
    const onChangePicture = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('newImg', newImg);  //mismo nombre que upload.single()
        formData.append('userOnline', JSON.stringify({id: user.id, mat: user.matricula}));
        
        try{
            const response = await fetch(`${API_URL}/profile/change_picture`,{
                method: 'PUT',
                body: formData             
            })

            if(!response.ok){
                const errors = await response.json();
                throw new Error(errors.message);
            }

            //Positivos
            clear(e);
            const data = await response.json();
            updateUser({ imgPerfil: data.newProf || user.imgPerfil });
           
            setMessage('Foto de Perfil cambiada');         

        }catch(error){
            console.error(error.message);
            setMessage('Algo salio mal: ', error.message) 
        }
    }

    return(
        <div className="col-md-6 border-light border-end border-3 text-center">
            <h1>{user?.nombre}</h1>      
            <img className="img-fluid rounded-circle mb-3" src={CLOUD_URL + user?.imgPerfil} 
                style={{width:150, height: 150, objectFit: 'contain'}}/>
            
            {newImg && (<small className="row">{newImg.name}</small>)}
            
            <form className="d-flex justify-content-center gap-2" onSubmit={onChangePicture} encType="multipart/form-data">
                <button className="btn btn-dark btn-lg rounded-circle" type="button" onClick={clear} title="Deshacer">
                    <small><i className="bi bi-arrow-counterclockwise"/></small>
                </button>
                
                <label className="btn btn-success border-0 btn-admin btn-lg rounded-circle" title="Cambiar Foto">
                    <i className="text-light bi bi-camera"></i> 
                    <input type="file" name="newImg" onChange={handleFileChange} 
                    onClick={clear} accept="image/*"/>
                </label>
                    
                <button className="btn btn-success border-0 btn-user btn-lg rounded-circle" 
                    type="submit" title="Guardar" id="liveAlertBtn">
                    <small><i className="text-light bi bi-floppy"/></small>
                </button>
            </form>
            <small><i className="bi bi-info-circle"/> Elige una foto y pulsa Guardar.</small>   
            <br/>
            <br/>           
        </div>
    )
}




function ChangeData({setMessage}){
    const { user, updateUser } = useAuth();
    const [newData, setNewData] = useState({nombre: user?.nombre, matricula: user?.matricula, 
                                            npass1: '', npass2:''});

    const Clear = () => {setNewData({nombre: user?.nombre, matricula: user?.matricula, 
                                        npass1: '', npass2:''})};

    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewData((prev) => ({
            ...prev,
            [name]:value
        }));
    }

    const handleUpdate = async(e) => {
        e.preventDefault();

        if(newData.npass1 !== newData.npass2){
            alert('La contraseñas no coinciden');
            return;
        }

        try{
            const response = await fetch(`${API_URL}/profile/rewrite_data`,{
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({newData, user})       
            })

            if(!response.ok){
                const errors = await response.json();
                setMessage(errors.message);
                throw new Error(errors.message);
            }
            
            //Positivos
            updateUser({
                nombre:    newData.nombre    || user.nombre,
                matricula: newData.matricula || user.matricula,
            });

            const data = await response.json();
            setMessage(data.message);   
        }catch(error){
            console.error(error); 
        }
    }
    
    return(
        <div className="col-md-6">
            <h1>Editar</h1>
            <form onSubmit={handleUpdate} className="d-flex flex-column gap-2">
                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="nombre">Nombre:</label>
                    <input className="form-control" type="text" value={newData.nombre} 
                    name="nombre" onChange={handleChange} required/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="matricula">Matricula:</label>
                    <input className="form-control" type="text" value={newData.matricula} 
                    name="matricula" maxLength={9} onChange={handleChange} required/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="npass1">Nueva Contraseña:</label>
                    <input  className="form-control" type="password" 
                    name="npass1" value={newData.npass1} onChange={handleChange}/>
                </div>

                <div className="input-group">
                    <label className="col-form-label me-1" htmlFor="npass2">Confirmar Contraseña:</label>
                    <input className="form-control" type="password" 
                    name="npass2" value={newData.npass2} onChange={handleChange}/>
                </div>

                <div className="text-end">
                    <button className="btn btn-dark me-1" type="button" onClick={Clear}>
                    <small><i className="bi bi-arrow-counterclockwise"/></small>
                    </button>

                    <button className="btn btn-primary" type="submit">
                        <i className="bi bi-pencil"/> Cambiar datos
                    </button>
                </div>
    
            </form>
        </div>
    )
}


function EditSection(){
    const [message, setMessage] = useState(null);
    
    return(
        <div className="text-light">            
            <SectionHeader title={'Mi Perfil'} iconClass={'person-circle'}/>
            
            {
                message && 
                <div id="liveAlert" className="alert alert-info alert-dimissible" role="alert">
                    {message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            <div className="p-3 justify-content-center">
               
                <div className="row">
                    <ChangePic setMessage={setMessage}/>
                    <ChangeData setMessage={setMessage}/>
                </div>
            </div>
        </div>
    )
}

export default EditSection;