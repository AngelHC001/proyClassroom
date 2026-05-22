import sql from 'mssql';

//SQL SERVER CONFIG
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


export const pool = await sql.connect(config); 
