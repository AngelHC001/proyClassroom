import express from 'express';
import fs from 'node:fs'       
import multer from 'multer'  
import bcrypt from 'bcrypt';

import sql from 'mssql';
import { pool } from './db_connection.js';
const router = express.Router();


//MULTER FILE UPLOAD CONFIG 
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'appUserData/');
    },
    filename: (req,file,cb) => {
        const uniqName = Date.now() + "-" + file.originalname;
        cb(null,uniqName);
    }
});

const upload = multer({storage});


//EDITAR PERFIL (UPLOAD SINGLE MUEVE ARCHIVO)
router.put('/change_picture', upload.single('newImg'), async(req,res) => {
    const userOnline = JSON.parse(req.body.userOnline);
    const newImg = req.file;

    if(!userOnline || !newImg){
        return res.status(400).json('SIN REQUISITOS PARA CAMBIOS');
    }

    if(!fs.existsSync('appUserData')){
        return res.status(400).json('SIN REQUISITOS PARA CAMBIOS');
    }

    try {
        //REGISTRAR NUEVO NOMBRE
        await pool.request()
            .input('idUsuario',sql.Int ,userOnline.id)
            .input('matricula',sql.NVarChar,userOnline.mat)
            .input('nombreImg',sql.NVarChar,newImg.filename)
            .query('UPDATE ALUMNO SET NOMBREIMG = @nombreImg WHERE IDUSUARIO = @idUsuario AND MATRICULA = @matricula;')

        return res.status(200).json({message: 'Foto de Perfil Cambiada', newProf: newImg.filename});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


//ACTUALIZAR DATOS
router.put('/rewrite_data', async(req,res) => {
    const { newData, user } = req.body;

    try {
        const request = await pool.request();
        request.input('idUsuario',sql.Int ,user.id)
        const setClauses = [];
        
        //Cambio nombre?
        if(newData.nombre !== user.nombre){
            request.input('newName',sql.NVarChar,newData.nombre)
            setClauses.push('NOMBRE = @newName');
        }
       
        //Cambio matricula?
        if(newData.matricula !== user.matricula){
            request.input('newMat',sql.NVarChar,newData.matricula)
            setClauses.push('MATRICULA = @newMat');
        }
      
        //NuevaPass?
        if(newData.npass1 !== ''){
            const newHashed = await bcrypt.hash(newData.npass1,10);
            request.input('contrasena',sql.NVarChar,newHashed)
            setClauses.push('CONTRASENA = @contrasena');  
        }

        //SIN CAMBIOS
        if(setClauses.length === 0){
            return res.status(400).json({message: 'Sin cambios ingresados'});
        }

        const query = `UPDATE ALUMNO SET ${setClauses.join(', ')} WHERE IDUSUARIO = @idUsuario`
        await request.query(query);
        return res.status(200).json({message: 'Datos Actualizados'});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


export default router;