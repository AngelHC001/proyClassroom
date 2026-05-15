import express from 'express';
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


//ELIMINAR POSTS (MIAS Y ADMIN)

/*
router.delete('/erase_comment/:id',async(req,res) => {
    const postTarget = req.params.id;

    if(!postTarget){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        await pool.request()
            .input('idPost', sql.Int, postTarget)
            .query('DELETE FROM POST WHERE IDPOST = @idPost');

        return res.status(200).json({message: 'Post Eliminado'});
    } catch (error) {
        console.error('Error al borrar el Post', error);
        res.status(500).json({message: 'Error interno del servidor (DeletePost)'}); 
    }
});
*/

export default router;