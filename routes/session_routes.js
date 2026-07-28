import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import { pool } from './db_connection.js'

const router = express.Router();


//LOGIN
router.post('/login', async(req,res)=>{
    const { mat, pass } = req.body;
    
    //Validación
    if (!mat || !pass) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        //BUSCAR USUARIO
        const result = await pool.query('SELECT * FROM ALUMNO WHERE MATRICULA = $1',[mat]);
        
        if(result.rows.length === 0)
            return res.status(401).json({message: 'Credenciales incorrectas'});

        const usuario = result.rows[0];
        const passValida = await bcrypt.compare(pass, usuario.contrasena);
        
        if(!passValida)
            return res.status(401).json({message: 'Credenciales incorrectas'});

        //crear token
        const token = jwt.sign({id: usuario.idUsuario, mat: usuario.matricula},
            'lssdsk2321lfno42OAHlNKklknJkpksai',{expiresIn:'2h'});

        //TODO SALIO BIEN DAR POSITIVO
        res.status(200).json({
            message:'Login Exitoso', 
            usuario:{
                id: usuario.idUsuario,
                nombre: usuario.nombre, 
                matricula: usuario.matricula,
                tipo: usuario.tipousuario,
                imgPerfil: usuario.nombreimg,
                tkn: token
            }
        });
    } catch (error) {
        console.error('Error en el insert:', error);
        res.status(500).json({message: 'Error interno del servidor'});     
    }
});


export default router;