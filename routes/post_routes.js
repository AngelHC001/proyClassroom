import express from 'express';

import sql from 'mssql';
import { pool } from './db_connection.js';
const router = express.Router();

//PUBLICAR INSERT Y DELETE
router.post('/upload_post', async(req,res) => {
    //recibe datos
    const {remitent ,title, content, files} = req.body;
    const date = new Date();

    //Validacion debe haber al menos uno ocupado
    if(!title && !content && files){
        return res.status(400).json({ message: 'Todos los campos estan vacios' });
    }

    try {
        //mover archivos si hay
            //CODIGO MOVER A CARPETA (DELEGADO)

        //Preparar consulta (FORMATEAR FECHA DESPUES)
        let fecha = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        let hora = `${date.getHours()}:${date.getMinutes()}`;
        let datosRemitente = `${remitent.matricula}-${remitent.nombre}`
        let idRemitente = remitent.id;

        await pool.request()
            .input('titulo',sql.NVarChar,title)
            .input('contenido', sql.NVarChar,content)
            .input('fechahora',sql.DateTime,`${fecha} ${hora}`)
            .input('stringfiles',sql.NVarChar,files)
            .input('remitente',sql.NVarChar,datosRemitente)
            .input('idUsuario',sql.Int,idRemitente)
            .query('INSERT INTO POST (TITULO,CONTENIDO,FECHAHORA,STRINGFILES,REMITENTE,IDUSUARIO)' +
                ' VALUES (@titulo, @contenido, @fechahora, @stringfiles, @remitente, @idUsuario)');
        
        //Dar positivo
        res.status(200).json({message: 'Se publicó tu post'})        
    } catch (error) {
        console.error('Error en el insert:', error);
        res.status(500).json({message: 'Error interno del servidor (PUBLICAR)'});     
    }
});


//VER PUBLICACIONES (TODAS, MIAS, ADMIN)
router.post('/fetch_posts', async(req,res) => {
    const { mode, userData } = req.body;

    if(!mode || !userData){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }
    
    try {
        const request = await pool.request();
        let query = "SELECT * FROM POST";

        //MODO MIS POSTS
        if(mode === 'my_posts'){
            request.input('idUsuario', sql.Int, userData.id);
            query += ' WHERE IDUSUARIO = @idUsuario';   
        }
        else if(mode === 'user_posts'){
            request.input('remitente', sql.NVarChar, `${userData.matricula}-${userData.nombre}`);
            query += ' WHERE REMITENTE != @remitente';
        }

        //DEFAULT GENERAL
        const result = await request.query(query);
        return res.status(200).json(result.recordset);
      
    } catch (error) {
        console.error('Algo salio mal al cargar', error);
        res.status(500).json({message: 'Error interno del servidor (FETCH)'}); 
    }
});

router.post('/like_post/:id', async(req,res) => {
    const postTarget = req.params.id;

    if(!postTarget){
        return res.status(400).json({ message: 'No hay post' });
    }

    try {
        await pool.request()
            .input('targetPost', sql.Int, postTarget)    
            .query('UPDATE POST SET LIKES = LIKES + 1 WHERE IDPOST = @targetPost');
        return res.status(200).json({message: 'Like Post +1'});
    } catch (error) {
        console.error('Error al dar like', error);
        res.status(500).json({message: 'Error interno del servidor (Like)'}); 
    }
});


//ELIMINAR POSTS (MIAS Y ADMIN)
router.delete('/erase_post/:id',async(req,res) => {
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


export default router;