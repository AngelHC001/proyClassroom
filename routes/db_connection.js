import { Pool } from "pg";
import process from 'process'
import dotenv from 'dotenv'
import { v2 } from "cloudinary";
import fs from 'fs';

dotenv.config();

const cert_key = fs.readFileSync('./certs/ca.pem').toString();

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    //ssl: { rejectUnauthorized: true, ca: cert_key}
});

//CLOUDINARY PARA SUBIR IMAGENES
const cloudinary = v2;

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error("⚠️ Faltan variables de entorno de Cloudinary");
}
else{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET 
    });
    console.log('CLOUDINARY CONECTADO');
}


async function startConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ POSTGRESQL Connection successful!');
        client.release();
    } catch (err) {
        console.error('❌ Connection failed! ', err.message);
    }
}

startConnection();


export { pool, cloudinary };