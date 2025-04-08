import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    paymentScreenshot: {
        type: String    },
    status: {
        type: String,
        default: 'pending',
    },
},

 { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;