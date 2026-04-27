import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/db.js';
import authRoute from './routes/auth.route.js';
import taskRoute from './routes/task.route.js';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute);
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
