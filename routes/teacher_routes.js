import express from 'express';

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
            ' FROM ALUMNO ORDER BY TIPOUSUARIO DESC');
        
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


router.delete('/erase_user',async(req,res) => {
    const deletionId = req.body;
    
    if(!deletionId){
        return res.status(400).json({message: 'Sin requisitos para borrar'})
    }
    
    try{
        await pool.request()
         .input('idUsuario',sql.Int, deletionId.userTarget)
         .query('DELETE FROM ALUMNO WHERE IDUSUARIO = @idUsuario')
        
        return res.status(200).json({message: 'Usuario Eliminado'})
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Admin):', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }

})


export default router;