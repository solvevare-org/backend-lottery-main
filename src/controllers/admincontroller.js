// filepath: /Users/apple/Downloads/project 4 copy/backend/src/controllers/admincontroller.js
import Ticket from '../models/ticket.js';
import { sendEmail } from '../services/notificationServices.js';

export const getPendingTickets = async (req, res) => {
    try {
        const pendingTickets = await Ticket.find({ status: 'pending' });
        res.status(200).json(pendingTickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        console.log(`Verifying ticket with ID: ${ticketId}`);
        
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.error(`Ticket with ID ${ticketId} not found`);
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = 'verified';
        await ticket.save();
        console.log(`Ticket with ID ${ticketId} verified`);

        const emailSubject = 'Your lottery ticket has been verified';
        const emailText = `Congratulations! Your ticket number ${ticket.ticketNumber} has been verified. You are now a participant in the lottery.`;

        await sendEmail(ticket.email, emailSubject, emailText);
        console.log(`Verification email sent to ${ticket.email}`);

        return res.status(200).json({ message: 'Ticket verified and email sent', ticket });
    } catch (error) {
        console.error('Error verifying ticket:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const rejectTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        console.log(`Rejecting ticket with ID: ${ticketId}`);

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.error(`Ticket with ID ${ticketId} not found`);
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await sendEmail(ticket.email, 'Your lottery ticket request has been rejected', `Your ticket number ${ticket.ticketNumber} has been rejected.`);
        console.log(`Rejection email sent to ${ticket.email}`);

        await Ticket.findByIdAndDelete(ticketId);
        console.log(`Ticket with ID ${ticketId} removed from database`);

        return res.status(200).json({ message: 'Ticket rejected and email sent' });
    } catch (error) {
        console.error('Error rejecting ticket:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const issueManualTicket = async (req, res) => {
    try {
        const { name, email, phone, nic } = req.body;

        // Validate form data
        if (!name || !email || !phone || !nic) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Generate a new ticket number
        const ticketNumber = `${nic}-ALM-${Math.floor(Math.random() * 10000)}`;

        const newTicket = new Ticket({
            ticketNumber,
            name,
            email,
            nic,
            status: 'verified', // Set status to verified
        });

        const savedTicket = await newTicket.save();

        // Send email notification
        const emailSubject = 'Your manual lottery ticket has been issued';
        const emailText = `Congratulations! Your ticket number ${ticketNumber} has been issued and verified. You are now a participant in the lottery.`;

        await sendEmail(email, emailSubject, emailText);

        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};