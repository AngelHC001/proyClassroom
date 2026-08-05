import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import process from 'process';

import { pool } from './db_connection.js'
const router = express.Router();
const HOMEMADE_TOKEN = process.env.HOMEMADE_TOKEN;

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
        const datos =  {
            id: usuario.idUsuario, 
            nombre: usuario.nombre, 
            matricula: usuario.matricula, 
            tipo: usuario.tipousuario, 
            imgPerfil: usuario.nombreimg
        };

        const passValida = await bcrypt.compare(pass, usuario.contrasena);
        
        if(!passValida)
            return res.status(401).json({message: 'Credenciales incorrectas'});

        //crear token
        const token = jwt.sign(datos, HOMEMADE_TOKEN,{expiresIn:'2h'});

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 100
        });

        //TODO SALIO BIEN DAR POSITIVO
        res.status(200).json({token: token, usuario: datos });
    } catch (error) {
        console.error('Error en el insert:', error);
        res.status(500).json({message: 'Error interno del servidor (SESSION/LOGIN)'});     
    }
});


router.get('/verify', async(req,res) => {
    const token = req.cookies.auth_token;

    if(!token){
        return res.status(201).json({message: 'No hay sesion activa'});
    }

    try {
        const decoded = jwt.verify(token, HOMEMADE_TOKEN);
        const user = {
            id: decoded.id, 
            nombre: decoded.nombre, 
            matricula: decoded.matricula,
            tipo: decoded.tipo,
            imgPerfil: decoded.imgPerfil
        }
        return res.status(200).json({token: token, usuario: user});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor (SESSION/VERIFY) ' + error}); 
    }
});


router.get('/exit', async(req,res) => {
    const token = req.cookies.auth_token;

    if(!token){
        return res.status(201).json({message: 'No hay sesion activa'});
    }

    try {
        res.clearCookie('auth_token');
        return res.status(200).json({message: 'CERRLA SESION'});
    } catch (error) {
        res.status(500).json({message: 'Error interno del servidor (SESSION/EXIT) ' + error}); 
    }
});


export default router;