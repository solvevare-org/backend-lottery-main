import Admin from '../models/admin.js'; // Ensure this import is correct
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import VerificationCode from '../models/verificationCode.js'; // Replace with your actual model

let verificationCode = null; // Declare verificationCode as a global variable

const predefinedAdmin = {
    username: 'sufiyan',
    email: 'sufyanakbar01239@gmail.com',
    password: '03111061826',
};

const ensureSingleAdmin = async () => {
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
        const admin = new Admin(predefinedAdmin);
        await admin.save();
    }
};

const sendVerificationCode = async (email) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

        // Save the code to the database
        await VerificationCode.findOneAndUpdate(
            { username: predefinedAdmin.username }, // Use the predefined admin username
            { code, expiresAt },
            { upsert: true, new: true } // Create or update the record
        );

        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            auth: {
                user: 'info@solvevare.com',
                pass: '@Solvevare2024',
            }
        });

        await transporter.sendMail({
            from: 'info@solvevare.com',
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
        });

        console.log('Verification code sent successfully to:', email);
    } catch (error) {
        console.error('Error sending verification code:', error);
        throw new Error('Failed to send verification code. Please try again later.');
    }
};

const signup = async (req, res) => {
    try {
        res.status(403).json({ error: 'Signup is restricted' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        await ensureSingleAdmin();

        const { username, password, code } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const admin = await Admin.findOne({ username: predefinedAdmin.username });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!code) {
            if (username !== predefinedAdmin.username || password !== predefinedAdmin.password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Send verification code if not provided
            await sendVerificationCode(predefinedAdmin.email);
            return res.status(200).json({ message: 'Verification code sent to your email' });
        }

        if (code !== verificationCode) {
            return res.status(401).json({ error: 'Invalid verification code' });
        }

        verificationCode = null; // Reset code after successful login


        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ error: error.message });
    }
};

const requestVerificationCode = async (req, res) => {
    try {
        await ensureSingleAdmin();
        await sendVerificationCode(predefinedAdmin.email);
        res.status(200).json({ message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Error requesting verification code:', error);
        res.status(400).json({ error: error.message });
    }
};

export const verifyCode = async (req, res) => {
    const { username, code } = req.body;

    try {
        // Fetch the stored verification code for the user
        const storedCode = await VerificationCode.findOne({ username });

        if (!storedCode) {
            return res.status(404).json({ error: 'Verification code not found' });
        }

        // Check if the code matches
        if (storedCode.code !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Check if the code has expired
        const now = new Date();
        if (storedCode.expiresAt < now) {
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Generate a token for the user
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Optionally delete the code after successful verification
        await VerificationCode.deleteOne({ username });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error verifying code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export { signup, login, requestVerificationCode };
