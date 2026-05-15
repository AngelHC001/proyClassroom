import express from 'express';

import sql from 'mssql';
import { pool } from './db_connection.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

//IMPORT multer
//-config storage
//-filtrar formatos (opcional)
//-config upload
//-set into server operation (post,put, delete, etc)

//CONFIGURAR DESTINO Y archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "appUploads/"); // tu carpeta destino
  },
  filename: (req, file, cb) => {
    const unique = "UploadedImg" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por archivo
});

//------FECHA HORA-------
const DATE_SOURCE = new Date();
function SetDate(){
    let fecha = `${DATE_SOURCE.getFullYear()}-${DATE_SOURCE.getMonth() + 1}-${DATE_SOURCE.getDate()}`;
    let hora = `${DATE_SOURCE.getHours()}:${DATE_SOURCE.getMinutes()}`;
    
    return `${fecha} ${hora}`;
}


//PUBLICAR INSERT Y DELETE
router.post('/upload_post', upload.array('images',5), async(req,res) => {
    //Recibe datos
    const {remitent ,title, content, mode, postTarget} = req.body;
    const files = req.files?.map((f) => f.filename) ?? [];
    
    //Validacion debe haber al menos uno ocupado
    if((title === '' && content === '') && files.lenght === 0){
        return res.status(400).json({ message: 'No hay nada que publicar' });
    }

    if(!fs.existsSync('appUploads')){
        return res.status(400).json('EL DIRECTORIO DE UPLOADS NO EXISTE');
    }

    try {
        const today = SetDate(); 
        const parsedUser = JSON.parse(remitent);
        const chained = files.join('-');

        if(mode === 'feed'){
            //PROCESO NORMAL DE POSTS    
            await pool.request()
                .input('titulo',sql.NVarChar,title)
                .input('contenido', sql.NVarChar,content)
                .input('fechahora',sql.DateTime,today)
                .input('stringfiles',sql.NVarChar,chained)
                .input('remitente',sql.NVarChar, `${parsedUser.matricula}-${parsedUser.nombre}`)
                .input('idUsuario',sql.Int,parsedUser.id)
                .query('INSERT INTO POST (TITULO,CONTENIDO,FECHAHORA,STRINGFILES,REMITENTE,IDUSUARIO)' +
                    ' VALUES (@titulo, @contenido, @fechahora, @stringfiles, @remitente, @idUsuario)');  
        }
        else if(mode === 'comment')
        {      
            //Validacion debe haber al menos uno ocupado
            if(!postTarget){
                return res.status(400).json({ message: 'Sin requisitos para comentar' });
            }

            await pool.request()
                .input('contenido', sql.NVarChar,content)
                .input('fechahora',sql.DateTime,today)
                .input('stringfiles',sql.NVarChar,chained)
                .input('remitente',sql.NVarChar, `${parsedUser.matricula}-${parsedUser.nombre}`)
                .input('idUsuario',sql.Int, parsedUser.id)
                .input('idPost', sql.Int, postTarget)
                .query('INSERT INTO COMENTARIO (CONTENIDO,FECHAHORA,STRINGFILES,REMITENTE,IDUSUARIO,IDPOST)' +
                    ' VALUES (@contenido, @fechahora, @stringfiles, @remitente, @idUsuario, @idPost)');
            
            //Actualizar comentarios de Post
            await pool.request()
            .input('idPost', sql.Int, postTarget)
            .query('UPDATE POST SET COMENTARIOS = COMENTARIOS + 1 WHERE IDPOST = @idPost');
        }

        //Dar positivo
        res.status(200).json({message: 'Publicado'})        
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