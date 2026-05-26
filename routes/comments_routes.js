import express from 'express';
import path from 'path';
import fs from 'fs';

import sql from 'mssql';
import { pool } from './db_connection.js';


const router = express.Router();

//VER COMENTARIOS
router.get('/fetch_comment/:id', async(req,res) => {
    const idPost = req.params.id;
    if(!idPost){
        return res.status(400).json({ message: 'Sin requisitos de consulta (COMENTARIOS)' });
    }

    try {
        const result = await pool.request()
            .input('idPost', sql.Int, idPost)
            .query("SELECT * FROM COMENTARIO WHERE IDPOST = @idPost");
        
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Algo salio mal al cargar (COMENTARIOS)', error);
        res.status(500).json({message: 'Error interno del servidor (COMENTARIOS)'}); 
    }
});


//ELIMINAR COMENTARIOS (MIAS Y ADMIN)
router.delete('/erase_comment',async(req,res) => {
    const { idComment, idPost, idUsuario, stringTarget } = req.body;

    if(!idComment || !idPost || !idUsuario){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        //EL COMENTARIO TIENE ARCHIVOS?
        if(stringTarget !== ''){
            let filesTarget = stringTarget.split('-');
                
            for (const file of filesTarget) {
                const filePath = path.resolve('./public/appUploads', file);
                        
                //Verificar y borrar
                await fs.accessSync(filePath);
                await fs.unlinkSync(filePath)
            }
        }

        //TRAS BORRADO ELIMINAR COMENTARIO
        await pool.request()
            .input('idComentario', sql.Int, idComment)    
            .input('idPost', sql.Int, idPost)
            .input('idUsuario', sql.Int, idUsuario)
            .query('DELETE FROM COMENTARIO WHERE IDCOMENTARIO = @idComentario ' + 
                'AND IDPOST = @idPost AND IDUSUARIO = @idUsuario');

        //actualizar post
        await pool.request()
            .input('idPost', sql.Int, idPost)
            .query('UPDATE POST SET COMENTARIOS = COMENTARIOS - 1 WHERE IDPOST = @idPost');

        return res.status(200).json({message: 'Comentario Eliminado'});
    } catch (error) {
        console.error('Error al borrar el comentario', error);
        res.status(500).json({message: 'Error interno del servidor (EraseComment)'}); 
    }
});


export default router;