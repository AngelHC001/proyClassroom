import express from 'express';
import bcrypt from 'bcrypt';

import { pool } from './db_connection.js';
import { extractPublicId, delete_cdy } from './utils.js';

const router = express.Router();

const DEFAULTPASS = 'alumno123';
const DEFAULTIMG = 'user.png';

//api/teacher/
router.get('/list_users',async(req,res) => {
    try{
        const result = await pool.query(`SELECT "idUsuario", NOMBRE, MATRICULA, TIPOUSUARIO 
                                    FROM ALUMNO ORDER BY TIPOUSUARIO DESC, MATRICULA ASC`);
        
        return res.status(200).json(result.rows);
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

        await pool.query(`INSERT INTO ALUMNO (NOMBRE, MATRICULA, CONTRASENA, TIPOUSUARIO, NOMBREIMG)
                        VALUES ($1, $2, $3, $4, $5)`, 
                        [newUser.nombre,newUser.matricula,newUser.tipo, hashedPassword, DEFAULTIMG]);
      
        return res.status(200).json({message: 'Nuevo usuario insertado'})
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Insert Admin):', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});

//BORRAR USUARIO
router.delete('/erase_user/:id',async(req,res) => {
    const deletionId = req.params.id;
    
    if(!deletionId){
        return res.status(400).json({message: 'Sin requisitos para borrar'})
    }
    
    try{
        //OBTENER ARCHIVOS QUE SUBIO
        const userPostFiles = await pool.query(`SELECT STRINGFILES FROM POST WHERE "idUsuario" = $1
                        AND STRINGFILES IS NOT NULL AND STRINGFILES != ''`, [deletionId]);

        const userCommentFiles = await pool.query(`SELECT STRINGFILES FROM COMENTARIO WHERE "idUsuario" = $1
                        AND STRINGFILES IS NOT NULL AND STRINGFILES != ''`,[deletionId]);

        const allFileRecords = [...userPostFiles.rows,...userCommentFiles.rows];
        
        //PROCESAR Y ELIMINAR
        for(const record of allFileRecords){
            if(record.stringfiles){
                const files = record.stringfiles.split('-');
                const publicIds = files.map((url) => extractPublicId(url));
                const deletePromises = publicIds.map(id => delete_cdy(id));
                await Promise.all(deletePromises);
            }
        }

        //BORRADO MANUAL
        // Borrar comentarios del usuario
        await pool.query('DELETE FROM COMENTARIO WHERE "idUsuario" = $1',[deletionId]);

        // Borrar posts del usuario
        await pool.query('DELETE FROM POST WHERE "idUsuario" = $1',[deletionId]);

        //Borrar el usuario
        await pool.query('DELETE FROM ALUMNO WHERE "idUsuario" = $1',[deletionId])
        
        return res.status(200).json({message: 'Usuario y todo su historial eliminado'})
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
        //SOLAMENTE POSTS   
        let queryStr = `SELECT p."idPost", p.TITULO, p.STRINGFILES, p.FECHAHORA,
                    (a.MATRICULA || '-' || a.NOMBRE) AS REMITENTE
                    FROM POST p 
                    INNER JOIN ALUMNO a ON p."idUsuario" = a."idUsuario"
                    WHERE p.STRINGFILES IS NOT NULL AND TRIM(STRINGFILES) <> $1`;
    
        const results = await pool.query(queryStr,['']);
        return res.status(200).json(results.rows);
    }
    catch(err){
        console.error('Ocurrio un error de consulta (Admin):', err);
        return res.status(500).json({message: 'Error interno del servidor'});
    }
});


router.delete('/erase_files', async(req,res) => {
    const { idPost, stringTarget, mode} = req.body;

    if(!idPost || !stringTarget || !mode){
        return res.status(400).json({message: 'Sin requisitos para consulta'})
    }

    try{
        //SE ASUME QUE TODOS LOS REQUISITOS YA ESTAN NO SE IGNORA NINGUNO
        let table = mode === 'fromPost' ? 'POST' : 'COMENTARIO';
        let idColumn = mode === 'fromPost' ? 'idPost' : 'idComentario';
        let filesTarget = stringTarget.split('-');
         
        const publicIds = filesTarget.map((url) => extractPublicId(url));
        const deletePromises = publicIds.map(id => delete_cdy(id));
        await Promise.all(deletePromises);
        
        //YA SE BORRO ACTUALIZAR DATOS POST
        await pool.query(`UPDATE ${table} SET STRINGFILES = '' 
                    WHERE "${idColumn}" = $1 AND STRINGFILES = $2`,[idPost,stringTarget]);

        return res.status(200).json({message: 'Archivo borrado'});
    }
    catch(err){
        console.error(`(ADMIN) Error al borrar ${err.message}`);
        return res.status(500).json({message: 'Error al borrar el archivo'});
    }
});

export default router;