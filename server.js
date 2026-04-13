//INITIALIZATE
//import fs from 'node:fs'        //filesystem
//import path from 'node:path'    //path
import express from 'express'   //app
import sql from 'mssql'
import cors from 'cors'
import bcrypt from 'bcrypt'

//APP SERVER INIT
const PORT = 3000;
const app = express();

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



//app.delete

//app.put

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT,() => {
    console.log('SERVER ACTIVATED!');
});


