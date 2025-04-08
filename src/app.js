import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db.js';
import adminRoutes from './routes/adminRoutes.js';
import lotteryRoutes from './routes/lotteryRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { signup, login, requestVerificationCode } from './controllers/authController.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/lottery', lotteryRoutes);
app.use('/ticket', ticketRoutes);
app.use('/auth', authRoutes); // Register auth routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/request-verification-code', requestVerificationCode);



const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
    .catch(err => console.error(err));

export default app;