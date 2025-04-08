
import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode;