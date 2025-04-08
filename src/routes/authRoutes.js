import express from 'express';
import { login, signup, requestVerificationCode, verifyCode } from '../controllers/authController.js'; // Import verifyCode controller

const router = express.Router();

router.post('/login', login); // Login route
router.post('/signup', signup); // Signup route
router.post('/request-verification-code', requestVerificationCode); // Request verification code route
router.post('/verify-code', verifyCode); // Verify code route

export default router;