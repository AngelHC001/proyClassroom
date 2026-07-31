import express from 'express';

import { pool } from './db_connection.js';
import { delete_cdy, extractPublicId } from './utils.js';

const router = express.Router();

//VER COMENTARIOS
router.get('/fetch_comment/:id', async(req,res) => {
    const idPost = req.params.id;
    if(!idPost){
        return res.status(400).json({ message: 'Sin requisitos de consulta (COMENTARIOS)' });
    }

    try {
        const result = await pool.query(
            `SELECT c.*, (a.matricula || '-' || a.nombre) AS remitente 
            FROM COMENTARIO c
            INNER JOIN ALUMNO a ON c."idUsuario" = a."idUsuario"
            WHERE c."idPost" = $1
            ORDER BY c.FECHAHORA ASC`,[idPost]);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Algo salio mal al cargar (COMENTARIOS)', error);
        res.status(500).json({message: 'Error interno del servidor (COMENTARIOS)'}); 
    }
});

//EDITAR COMENTARIOS
router.put('/edit_comment', async(req,res)=>{
    const { newContent, commentTarget, postOrigin, idUser} = req.body;
    
    if(!postOrigin || !commentTarget){
        return res.status(400).json({ message: 'Sin requisitos de consulta (COMENTARIOS)' });
    }

    try {
        await pool.query(`UPDATE COMENTARIO SET CONTENIDO = $1 WHERE "idComentario" = $2 
                        AND "idUsuario" = $3 AND "idPost" = $4`, 
                        [newContent,commentTarget,idUser,postOrigin]);

        return res.status(200).json({message: 'Comentario Editado'});
    } catch (error) {
        console.error('Algo salio mal al cargar (EDITAR COMENTARIO)', error);
        res.status(500).json({message: 'Error interno del servidor (EDITAR COMENTARIO)'}); 
    }
});


//ELIMINAR COMENTARIOS (MIAS Y ADMIN)
router.delete('/erase_comment',async(req,res) => {
    const { idComment, idPost, idUsuario, stringTarget } = req.body;

    if(!idComment || !idPost || !idUsuario){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        //EL COMENTARIO TIENE ARCHIVOS? VERIFICAR Y BORRAR
        if(stringTarget && stringTarget !== ''){
            let filesTarget = stringTarget.split('-');
            const publicIds = filesTarget.map((url) => extractPublicId(url));
            const deletePromises = publicIds.map(id => delete_cdy(id));
            await Promise.all(deletePromises);    
        }

        //TRAS BORRADO ELIMINAR COMENTARIO
        await pool.query(`DELETE FROM COMENTARIO WHERE "idComentario" = $1 
                AND "idPost" = $2 AND "idUsuario" = $3`, [idComment,idPost,idUsuario]);

        //Actualizar sus comentarios
        await pool.query('UPDATE POST SET COMENTARIOS = COMENTARIOS - 1 WHERE "idPost" = $1',[idPost]);

        return res.status(200).json({message: 'Comentario Eliminado'});
    } catch (error) {
        console.error('Error al borrar el comentario', error);
        res.status(500).json({message: 'Error interno del servidor (EraseComment)'}); 
    }
});


export default router;