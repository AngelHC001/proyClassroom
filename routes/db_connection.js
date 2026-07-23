//import sql from 'mssql';
import { Pool } from "pg";
import process from 'process'
import dotenv from 'dotenv'
dotenv.config();


const pool = new Pool({
    host: process.env.VITE_PGHOST,
    port: process.env.VITE_PGPORT,
    user: process.env.VITE_PGUSER,
    password: process.env.VITE_PGPASSWORD,
    database: process.env.VITE_PGDATABASE
});

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

export { pool };

/*SQL SERVER CONFIG
const config = {
    server: "localhost",
    user: 'ClassroomTester',
    password: 'classroom$2026',
    database: 'ProyClassroom',
    timezone: '-06:00',
    port: 1433,
    options:{
        encrypt: false,                 // Set to true if using Azure or SSL
        trustServerCertificate: true    // For local development
    }    
};

/*
let pool;
async function startConnection() {
    try {
        const pool = await sql.connect(config);
        console.log('✅ SQL SERVER Connection successful!');
    } catch (err) {
        console.error('❌ Connection failed! ', err.message);
    }
}*/






