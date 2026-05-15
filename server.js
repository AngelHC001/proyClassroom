//INITIALIZATE
import express from 'express'
import cors from 'cors'

//IMPORT ROUTES
import sessionRoutes from './routes/session_routes.js'
import postRoutes from './routes/post_routes.js'
import profileRoutes from './routes/profile_routes.js'
import teacherRoutes from './routes/teacher_routes.js'
import commentRoutes from './routes/comments_routes.js'

//APP SERVER INIT
const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/session',sessionRoutes)
app.use('/api/posts',postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profile',profileRoutes);
app.use('/api/teacher',teacherRoutes);


app.listen(PORT,() => {
    console.log('SERVER ACTIVATED!');
});