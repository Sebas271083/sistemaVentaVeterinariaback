import dotenv from "dotenv";

dotenv.config();

console.log("CWD =", process.cwd());
console.log("ENV loaded MAIL_USER =", process.env.EMAIL_FROM);
console.log("ENV loaded MAIL_PASS =", process.env.EMAIL_PASSWORD ? "OK" : "VACIO");

import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';




import contactoRoutes from './routes/contactoRoutes.js';
// import petsRoutes from './routes/pets.js';
// import authRoutes from './routes/auth.js';
// import usersRoutes from './routes/users.js';
// import appointmentsRoutes from './routes/appointments.js';


const app = express();

// Settings
app.set('port', process.env.PORT || 8081);  
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));


// Middlewares
// app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN?.split(",") || ["http://localhost:5173", "http://localhost:8081"],
  })
);
app.use(express.json({ limit: "100kb" })); // evita payloads gigantes
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());    
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

// Routes
app.use('/api/contacto', contactoRoutes);
// app.use('/api/pets', petsRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/appointments', appointmentsRoutes);

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});

export default app;
