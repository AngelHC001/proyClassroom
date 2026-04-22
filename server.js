//INITIALIZATE
import fs from 'node:fs'        //filesystem
import multer from 'multer' 
import express from 'express'   //app
import cors from 'cors'

import bcrypt from 'bcrypt'
import sql from 'mssql'
import { pool } from './routes/db_connection.js'

import postRoutes from './routes/post_routes.js'



//APP SERVER INIT
const PORT = 3000;
const app = express();


//MULTER FILE UPLOAD CONFIG 
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'appUserData/');
    },
    filename: (req,file,cb) => {
        const uniqName = Date.now() + "-" + file.originalname;
        cb(null,uniqName);
    }
});

const upload = multer({storage});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//REGISTER
app.post('/api/register', async(req,res) => {
    const { name, mat, pass } = req.body;
    
    //Validación básica
    if (!name || !mat || !pass) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    //PROCESO
    try{
        //hashear pass
        const hashedPassword = await bcrypt.hash(pass,10);
        const defaultImg = 'user.png';
        
        //Conexion y consulta  
        await pool.request()
            .input('nombre',sql.NVarChar,name)
            .input('matricula',sql.NVarChar,mat)
            .input('contrasena',sql.NVarChar,hashedPassword)
            .input('nombreImg', sql.NVarChar,defaultImg)
            .query('INSERT INTO ALUMNO (NOMBRE, MATRICULA, CONTRASENA, TIPOUSUARIO, NOMBREIMG) VALUES (@nombre, @matricula, @contrasena,0,@nombreImg)')
        
        //Dar positivo
        res.status(201).json({message: 'Registrado con exito, Puedes iniciar sesion'})
    }catch(err){
        console.error('Error en el insert:', err);
        res.status(500).json({message: 'Error interno del servidor'});
    }
});

//LOGIN
app.post('/api/login', async(req,res)=>{
    const { mat, pass } = req.body;
    
    //Validación
    if (!mat || !pass) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        //BUSCAR USUARIO
        const result = await pool.request()
            .input('matricula',sql.NVarChar,mat)
            .query('SELECT * FROM ALUMNO WHERE MATRICULA = @matricula');

        if(result.recordset.lenght === 0)
            return res.status(401).json({message: 'Credenciales incorrectas'});

        const usuario = result.recordset[0];
        const passValida = await bcrypt.compare(pass, usuario.contrasena);
        
        if(!passValida)
            return res.status(401).json({message: 'Credenciales incorrectas'});

        //TODO SALIO BIEN DAR POSITIVO
        res.status(200).json({
            message:'Login Exitoso', 
            usuario:{
                id: usuario.idUsuario,
                nombre: usuario.nombre, 
                matricula: usuario.matricula,
                tipo: usuario.tipoUsuario,
                imgPerfil: usuario.nombreImg
            }
        });
        
    } catch (error) {
        console.error('Error en el insert:', error);
        res.status(500).json({message: 'Error interno del servidor'});     
    }
});




//EDITAR PERFIL (UPLOAD SINGLE MUEVE ARCHIVO)
app.put('/api/change_picture', upload.single('newImg'), async(req,res) => {
    const userOnline = JSON.parse(req.body.userOnline);
    const newImg = req.file;

    if(!userOnline || !newImg){
        return res.status(400).json('SIN REQUISITOS PARA CAMBIOS');
    }

    if(!fs.existsSync('appUserData')){
        return res.status(400).json('SIN REQUISITOS PARA CAMBIOS');
    }

    try {
        //REGISTRAR NUEVO NOMBRE
        await pool.request()
            .input('idUsuario',sql.Int ,userOnline.id)
            .input('matricula',sql.NVarChar,userOnline.mat)
            .input('nombreImg',sql.NVarChar,newImg.filename)
            .query('UPDATE ALUMNO SET NOMBREIMG = @nombreImg WHERE IDUSUARIO = @idUsuario AND MATRICULA = @matricula;')

        return res.status(200).json({message: 'Foto de Perfil Cambiada', newProf: newImg.filename});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


//ACTUALIZAR DATOS
app.put('/api/rewrite_data', async(req,res) => {
    const { newData, user } = req.body;

    try {
        const request = await pool.request();
        request.input('idUsuario',sql.Int ,user.id)
        const setClauses = [];
        
        //Cambio nombre?
        if(newData.nombre !== user.nombre){
            request.input('newName',sql.NVarChar,newData.nombre)
            setClauses.push('NOMBRE = @newName');
        }
       
        //Cambio matricula?
        if(newData.matricula !== user.matricula){
            request.input('newMat',sql.NVarChar,newData.matricula)
            setClauses.push('MATRICULA = @newMat');
        }
      
        //NuevaPass?
        if(newData.npass1 !== ''){
            const newHashed = await bcrypt.hash(newData.npass1,10);
            request.input('contrasena',sql.NVarChar,newHashed)
            setClauses.push('CONTRASENA = @contrasena');  
        }

        //SIN CAMBIOS
        if(setClauses.length === 0){
            return res.status(400).json({message: 'Sin cambios ingresados'});
        }

        const query = `UPDATE ALUMNO SET ${setClauses.join(', ')} WHERE IDUSUARIO = @idUsuario`
        await request.query(query);
        return res.status(200).json({message: 'Datos Actualizados'});  
    } catch (error) {
        console.error('Error al actualizar perfil', error);
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});


app.use('/api/posts',postRoutes);

//app.use()



app.listen(PORT,() => {
    console.log('SERVER ACTIVATED!');
});


