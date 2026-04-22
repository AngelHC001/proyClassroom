import express from 'express';
import { pool } from './db_connection.js';
const router = express.Router();

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


/*
router.post('/register_user',async(req,res) => {
    

})

router.delete('/erase_user',async(req,res) => {
    

})
*/

export default router;