import express from 'express';
import fs from 'fs';
import path from 'path';

import bcrypt from 'bcrypt';
import sql from 'mssql';
import { pool } from './db_connection.js';

const router = express.Router();

const DEFAULTPASS = 'alumno123';
const DEFAULTIMG = 'user.png';

//api/teacher/
router.get('/list_users',async(req,res) => {
    try{
        const result = await pool.query('SELECT IDUSUARIO, NOMBRE, MATRICULA, TIPOUSUARIO' + 
            ' FROM ALUMNO ORDER BY TIPOUSUARIO DESC, MATRICULA ASC');
        
        return res.status(200).json(result.recordset)
    }
    catch(err){
        console.error('Ocurrio un error de consulta:', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});


router.post('/register_user',async(req,res) => {
    const newUser = req.body;

    if(!newUser){
        return res.status(400).json({message:'Sin requisitos para insertar'});
    }
    
    try{
        const hashedPassword = bcrypt.hashSync(DEFAULTPASS,10);

        await pool.request()
            .input('nombre',sql.NVarChar,newUser.nombre)
            .input('matricula',sql.NVarChar,newUser.matricula)
            .input('tipoUsuario',sql.Int,newUser.tipo)
            .input('contrasena',sql.NVarChar,hashedPassword)
            .input('nombreImg', sql.NVarChar,DEFAULTIMG)
            .query('INSERT INTO ALUMNO (NOMBRE, MATRICULA, CONTRASENA, TIPOUSUARIO, NOMBREIMG)' +
                ' VALUES (@nombre, @matricula, @contrasena, @tipoUsuario, @nombreImg)');
      
        return res.status(200).json({message: 'Nuevo usuario insertado'})
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Insert Admin):', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});


router.delete('/erase_user/:id',async(req,res) => {
    const deletionId = req.params.id;
    
    if(!deletionId){
        return res.status(400).json({message: 'Sin requisitos para borrar'})
    }
    
    try{
        await pool.request()
         .input('idUsuario',sql.Int, deletionId)
         .query('DELETE FROM ALUMNO WHERE IDUSUARIO = @idUsuario')
        
        return res.status(200).json({message: 'Usuario Eliminado'})
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Admin):', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});




//SECCION MANAGE FILES
router.get('/fetch_files/:id',async(req,res) => {
    const fetchMode = req.params.id;
    
    if(!fetchMode){
        return res.status(400).json({message: 'Sin requisitos para consulta'})
    }
    
    try{
        let queryStr = '';
        const request = await pool.request()
            .input('stringfiles',sql.NVarChar,'')

        //Post o comment
        if(fetchMode === "0")
            queryStr = 'SELECT IDPOST, TITULO, STRINGFILES, REMITENTE, FECHAHORA' + 
                    ' FROM POST WHERE STRINGFILES IS NOT NULL AND TRIM(STRINGFILES) <> @stringfiles';
        else if(fetchMode === "1")
            queryStr = 'SELECT IDPOST, STRINGFILES, REMITENTE, FECHAHORA FROM COMENTARIO WHERE STRINGFILES != @stringfiles';
        
        
        const results = await request.query(queryStr);
        return res.status(200).json(results.recordset);
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Admin):', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});


router.delete('/erase_files', async(req,res) => {
    const { idPost, stringTarget, mode} = req.body;

    if(!idPost || !stringTarget || !mode){
        return res.status(400).json({message: 'Sin requisitos para consulta'})
    }
    
    if(!fs.existsSync('./public/appUploads')){
        return res.status(400).json({message: 'La carpeta Uploads no existe'})
    }

    try{
        //SE ASUME QUE TODOS LOS REQUISITOS YA ESTAN NO SE IGNORA NINGUNO
        let table = mode === 'fromPost' ? 'POST' : 'COMENTARIO';
        let filesTarget = stringTarget.split('-');
        
        for (const file of filesTarget) {
            const filePath = path.resolve('./public/appUploads', file);
            
            //Verificar y borrar
            await fs.accessSync(filePath);
            await fs.unlinkSync(filePath)
        }

        //YA SE BORRO ACTUALIZAR DATOS POST
        await pool.request()
            .input('idPost',sql.Int,idPost)
            .input('stringfiles',sql.NVarChar,stringTarget)
            .query(`UPDATE ${table} SET STRINGFILES = '' WHERE IDPOST = @idPost AND STRINGFILES = @stringfiles`);

        return res.status(200).json({message: 'Archivo borrado'});
    }
    catch(err){
        if(err.code === 'ENOENT'){
            console.warn(`(ADMIN) Archivo no encontrado`);
        } 
        else {
            console.error(`(ADMIN) Error al borrar ${err.message}`);
        }
    }
});




export default router;