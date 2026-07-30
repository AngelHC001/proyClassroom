import express from 'express';
import multer from 'multer'  
import bcrypt from 'bcrypt';
import { pool, cloudinary } from './db_connection.js';

const router = express.Router();

//MULTER FILE UPLOAD CONFIG 
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

const upload_cdy = (buffer,foldername) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder:foldername},
            (error,result) => {
                if(result)
                    resolve(result);
                else
                    reject(error);
            }
        );
        stream.end(buffer);
    });
}

//EDITAR PERFIL (UPLOAD SINGLE MUEVE ARCHIVO)
router.put('/change_picture', upload.single('newImg'), async(req,res) => {
    const userOnline = JSON.parse(req.body.userOnline);
    const newImg = req.file;

    if(!userOnline || !newImg){
        return res.status(400).json('SIN REQUISITOS PARA CAMBIOS');
    }

    try {
        //SUBIR A CLOUDINARY
        const result = await upload_cdy(newImg.buffer, 'userData');
        
        //REGISTRAR NOMBRE DE ARCHIVO
        await pool.query(`UPDATE ALUMNO SET NOMBREIMG = $1 WHERE "idUsuario" = $2 AND MATRICULA = $3`, 
                        [result.secure_url, userOnline.id, userOnline.mat])

        return res.status(200).json({message: 'Foto de Perfil Cambiada', newProf: result.secure_url});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


//ACTUALIZAR DATOS
router.put('/rewrite_data', async(req,res) => {
    const { newData, user } = req.body;

    try {
        const params = []; 
        const setClauses = [];
        
        //Cambio nombre?
        if(newData.nombre !== user.nombre){
            params.push(newData.nombre);
            setClauses.push(`NOMBRE = $${params.length}`);
        }
       
        //Cambio matricula?
        if(newData.matricula !== user.matricula){
            params.push(newData.matricula);
            setClauses.push(`MATRICULA = $${params.length}`);
        }
      
        //NuevaPass?
        if(newData.npass1 !== ''){
            const newHashed = await bcrypt.hash(newData.npass1,10);
            params.push(newHashed);
            setClauses.push(`CONTRASENA = $${params.length}`);  
        }

        //SIN CAMBIOS
        if(setClauses.length === 0){
            return res.status(400).json({message: 'Sin cambios ingresados'});
        }

        params.push(user.id);
        const query = `UPDATE ALUMNO SET ${setClauses.join(', ')} WHERE "idUsuario" = $${params.length}`
        await pool.query(query,params);
      
        return res.status(200).json({message: 'Datos Actualizados'});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


export default router;