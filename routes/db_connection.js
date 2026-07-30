import { Pool } from "pg";
import process from 'process'
import dotenv from 'dotenv'
import { v2 } from "cloudinary";

dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: { 
        rejectUnauthorized: true, 
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUC35r8Q7E15ibrwGjS0EJ7vl2AicwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYTE0NTBkNDUtZDFiOS00NTI0LTg5YjctMWY4MTVhOWQ2
MGQ2IFByb2plY3QgQ0EwHhcNMjYwNzI4MTU0NDA2WhcNMzYwNzI1MTU0NDA2WjA6
MTgwNgYDVQQDDC9hMTQ1MGQ0NS1kMWI5LTQ1MjQtODliNy0xZjgxNWE5ZDYwZDYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANb/j52h
mrkGdk5osJdMCyAkEMPG6SW2WjT5YTjnk9fPP31sDWMNCndKNe6gqIDnYNlLPsGS
FrujHKEKoqw+XtIAvXRccNfRJbZgMvjdtlGTIsxR+NDx+CQUq/d1KVtHbJphbf+h
7uScu+Xzx2gU6l86AXENpiVwFcpferZAM8Zexx4reCbe2KhCg3UT6puvDoK7HuMS
HaHOHtwb/rAjd/f4kgZwzlW24C0LHL+qnd1WmPCOXSXb8AO4EWniwzojH8amKlNG
SwOelbfBaIu52kAfOpRi76VedSoncSL4rJ9l/RgssP/aJ/M52LF6XhbSYhYzCzHj
rVh/kSdDsNbh/qais/yzIh5oOy0sPBCmp3abx0kUqnTjUXrt33Pc5dZi86GwJi/c
CgA7nIOWRQ+YUayIplcIlwELMLELBJ4+7phklkHsBF+iwhGq8O9qE9c/OyO0zCDo
XrsnxdRdk3q68wSga8KOBtU25ytV6mUxcrVJYPikwdHbd7x+bmcHFCvLAwIDAQAB
o0IwQDAdBgNVHQ4EFgQUZ9i7Olw+HSVbTottX0fzl43tVPQwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAGATPPn3klL2
UrrYRsbVqugIMnqCZoDf7UqKoT0aq/PUpwxHXAAK5V9kdd1kfonY7p9wDX4Oj5r7
sHbyyM7I7zO2ZP/yK5AVg53inFYH1n7d4ErPh+KWLQW8MxvdMlDadZWar1OFho5u
m6OwPNeraPomBtlbLvKKKm1a/MfT0hnsioMTEkFqXJOdoLeKcPJUR6kUHsOUh0FL
uDsbdRJjLGCwOLvODwNEsgexCJlWPeYnxPSilNsqkodPZV0OkB3Gpq+EsLqpICKN
hK70+kpQJk7Q6bp6cgl5YZyfpAC8Pg+gz8fGD1fhcNcZ0c3BWDW64iGXHqWHdRzy
oMk2bXbWiedk00Uow4CdbXsHG3JcRIHYbnb5/jLpp2NakLauL5WRUNOjxDlTqjIk
H/xVVVFTcS7reG7lk0gCG2WNetNFi2TeFehgf3kgjhipvbrZNdW+ZFng2AJ6QEE0
QYZcn3MJoQmpNfS6SuP1xF5coQm9Itte/7TSQ4c9T40TdGXFYu5bcA==
-----END CERTIFICATE-----` },
});

//CLOUDINARY PARA SUBIR IMAGENES
// Validación
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error("⚠️ Faltan las variables de entorno de Cloudinary");
}

const cloudinary = v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET 
});

console.log('CLOUDINARY CONECTADO');



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