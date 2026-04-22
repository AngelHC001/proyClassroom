//INITIALIZATE
import fs from 'node:fs'        //filesystem
import multer from 'multer' 

import express from 'express'   //app
import sql from 'mssql'
import cors from 'cors'
import bcrypt from 'bcrypt'


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

//SQL SERVER CONFIG
const config = {
    server: "localhost",
    user: 'ClassroomTester',
    password: 'classroom$2026',
    database: 'ProyClassroom',
    port: 1433,
    options:{
        encrypt: false,                 // Set to true if using Azure or SSL
        trustServerCertificate: true    // For local development
    }    
};

let pool;
async function startConnection() {
    try {
        pool = await sql.connect(config);
        console.log('✅ SQL SERVER Connection successful!');
    } catch (err) {
        console.error('❌ Connection failed! ', err.message);
    }
}
startConnection();


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

//PUBLICAR INSERT Y DELETE
app.post('/api/upload_post', async(req,res) => {
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
        res.status(500).json({message: 'Error interno del servidor'});     
    }
});

//VER PUBLICACIONES (TODAS, MIAS, ADMIN)
app.post('/api/fetch_posts', async(req,res) => {
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
        res.status(500).json({message: 'Error interno del servidor'}); 
    }
});

//ELIMINAR POSTS (MIAS Y ADMIN)
app.delete('/api/erase_post',async(req,res) => {
    const {mode, postTarget } = req.body;

    if(!mode || !postTarget){
        return res.status(400).json({ message: 'Sin requisitos de consulta' });
    }

    try {
        const request = await pool.request();
        //MODO MIS POSTS
        if(mode === 'my_posts' || mode === 'user_posts'){
            request.input('idPost', sql.Int, postTarget.idPost)
            await request.query('DELETE FROM POST WHERE IDPOST = @idPost');
        }
       
        return res.status(200).json({message: 'Post Eliminado'});
    } catch (error) {
        console.error('Error al borrar el Post', error);
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



app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT,() => {
    console.log('SERVER ACTIVATED!');
});


