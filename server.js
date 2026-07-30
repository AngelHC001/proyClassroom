//INITIALIZATE
import express from 'express';
import cors from 'cors';
import process from 'process';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

//IMPORT ROUTES
import sessionRoutes from './routes/session_routes.js'
import postRoutes from './routes/post_routes.js'
import profileRoutes from './routes/profile_routes.js'
import teacherRoutes from './routes/teacher_routes.js'
import commentRoutes from './routes/comments_routes.js'

//APP SERVER INIT
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = { origin: process.env.NODE_ENV === 'production' ?
    'https://proyclassroom.onrender.com' : 'http://localhost:5173'
    , credentials: true }


const PORT = 3000;
const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
app.use('/api/session',sessionRoutes)
app.use('/api/posts',postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/teacher',teacherRoutes);

//Redirigir al frontend
app.use(express.static(path.join(__dirname,'dist')))

app.get(/^(?!\/api).*/,(req,res) => {
    res.sendFile(path.join(__dirname,'dist','index.html'));
})

//Ping mientras 
app.head('/api/ping', (req,res) => {
    console.log('TIC');
    res.status(200).end();
});

app.listen(PORT,() => {
    console.log('SERVER ACTIVATED!');
});