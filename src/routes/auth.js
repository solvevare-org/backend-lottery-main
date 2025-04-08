import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login); // Login route
router.post('/signup', signup); // Signup route

export default router;