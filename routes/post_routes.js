import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { pool } from './db_connection.js';

const router = express.Router();

//IMPORT multer
//-config storage
//-filtrar formatos (opcional)
//-config upload
//-set into server operation (post,put, delete, etc)

//CONFIGURAR DESTINO Y archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/appUploads/"); // tu carpeta destino
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

//PUBLICAR INSERT Y DELETE
router.post('/upload_post', upload.array('images',5), async(req,res) => {
    //Recibe datos
    const { title, content, remitent, mode, postTarget} = req.body;
    const files = req.files?.map((f) => f.filename) ?? [];
    
    //Validacion debe haber al menos uno ocupado
    if(title === '' && content === '' && files.length === 0){
        return res.status(400).json({ message: 'No hay nada que publicar' });
    }

    if(!fs.existsSync('./public/appUploads')){
        return res.status(400).json('EL DIRECTORIO DE UPLOADS NO EXISTE');
    }

    try {
        const parsedUser = JSON.parse(remitent);
        const chained = files.join('-');
        const now = new Date(); 

        if(mode === 'feed'){
            //PROCESO NORMAL DE POSTS    
            await pool.query(`INSERT INTO POST (TITULO,CONTENIDO,FECHAHORA,STRINGFILES,"idUsuario")
                            VALUES ($1, $2, $3, $4, $5)`,[title,content,now,chained,parsedUser.id]);  
        }
        else if(mode === 'comment')
        {      
            //Validacion debe haber al menos uno ocupado
            if(!postTarget){
                return res.status(400).json({ message: 'Sin requisitos para comentar' });
            }

            await pool.query(`INSERT INTO COMENTARIO (CONTENIDO,FECHAHORA,STRINGFILES,"idUsuario","idPost")
                         VALUES ($1, $2, $3, $4, $5)`, [content,now,chained,parsedUser.id, postTarget]);
            
            //Actualizar comentarios de Post
            await pool.query('UPDATE POST SET COMENTARIOS = COMENTARIOS + 1 WHERE "idPost" = $1',[postTarget]);
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
        let query = `SELECT p.*, (a.matricula || '-' || a.nombre) AS remitente 
            FROM POST p
            INNER JOIN ALUMNO a ON p."idUsuario" = a."idUsuario"`;

        const params = [];
        //MODO MIS POSTS
        if(mode === 'my_posts'){
            query += ` WHERE p."idUsuario" = $1`;   
            params.push(userData.id);
        }
        else if(mode === 'user_posts'){   
            query += ` WHERE p."idUsuario" != $1`;
            params.push(userData.id);
        }

        //DEFAULT GENERAL
        query += ` ORDER BY p.FECHAHORA ASC`;
        const result = await pool.query(query, params.length > 0 ? params : undefined);
        return res.status(200).json(result.rows);  
    } catch (error) {
        console.error('Algo salio mal al cargar', error);
        res.status(500).json({message: 'Error interno del servidor (FETCH)'}); 
    }
});

router.get('/like_post/:id', async(req,res) => {
    const postTarget = req.params.id;

    if(!postTarget){
        return res.status(400).json({ message: 'No hay post que dar like' });
    }

    try {
        await pool.query('UPDATE POST SET LIKES = LIKES + 1 WHERE "idPost" = $1',[postTarget]);
        return res.status(200).json({message: 'Like Post +1'});
    } catch (error) {
        console.error('Error al dar like', error);
        res.status(500).json({message: 'Error interno del servidor (Like)'}); 
    }
});


//ELIMINAR POSTS (MIAS Y ADMIN)
router.delete('/erase_post',async(req,res) => {
    //Consultar idPost y sus archivos
    const { postTarget, stringTarget } = req.body;

    if(!postTarget){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        //VERIFICAR Y BORRAR ARCHIVOS
        if(stringTarget !== ''){
            let filesTarget = stringTarget.split('-');
            for (const file of filesTarget) {
                const filePath = path.resolve('./public/appUploads', file);   
                await fs.accessSync(filePath);
                await fs.unlinkSync(filePath)
            }
        }

        //BORRAR POST COMENTARIOS DELETE ON CASCADE
        await pool.query('DELETE FROM POST WHERE "idPost" = $1',[postTarget]);
        return res.status(200).json({message: 'Post Eliminado'});
    } catch (error) {
        console.error('Error al borrar el Post', error);
        res.status(500).json({message: 'Error interno del servidor (DeletePost)'}); 
    }
});


//EDITAR POST
router.put('/update_post', async(req,res) => {
    const { newTitle, newContent, idPost, idUser } = req.body;

    if(!idPost || !idUser){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        await pool.query(`UPDATE POST SET TITULO = $1, CONTENIDO = $2 
                    WHERE "idPost" = $3 AND "idUsuario" = $4`,[newTitle,newContent,idPost,idUser]);

        return res.status(200).json({message: 'Post Actualizado'}); 
    } catch (error) {
        console.error('Error al actualizar el Post', error);
        res.status(500).json({message: 'Error interno del servidor (UpdatePost)'}); 
    }
});

export default router;