import Ticket from '../models/ticket.js';
import mongoose from 'mongoose';

export const purchaseTicket = async (req, res) => {
    try {
        const { name, phone, email, nic } = req.body;

        // Validate form data
        if (!name || !phone || !email || !nic) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const paymentScreenshot = req.file; // Access the uploaded file

        // Check for existing ticket with the same NIC
        const existingTicket = await Ticket.findOne({ nic });

        let ticketNumber;
        if (existingTicket) {
            // Extract the existing ticket number and increment the suffix
            const existingTicketNumber = existingTicket.ticketNumber;
            const suffix = parseInt(existingTicketNumber.split('-')[1].split('ALM-')[1]) + 1;
            ticketNumber = `${nic}-ALM-${suffix}`;
        } else {
            // Generate a new ticket number
            ticketNumber = `${nic}-ALM-1`;
        }

        const newTicket = new Ticket({
            ticketNumber,
            name,
            phone,
            email,
            nic,
            paymentScreenshot: paymentScreenshot ? paymentScreenshot.filename : null, // Store the filename of the uploaded file
            status: 'pending', // Initial status set to pending for admin approval
        });

        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getVerifiedTickets = async (req, res) => {
    try {
        console.log('Fetching verified tickets'); // Add this line
        const verifiedTickets = await Ticket.find({ status: 'verified' }); // Update the query to find verified tickets
        res.status(200).json(verifiedTickets);
    } catch (error) {
        console.error('Error fetching verified tickets:', error); // Add this line
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getRandomWinners = async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 100;
        const verifiedTickets = await Ticket.aggregate([
            { $match: { status: 'verified' } },
            { $sample: { size: count } }
        ]);
        res.status(200).json(verifiedTickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const selectFinalWinner = async (req, res) => {
    try {
        const { finalists } = req.body;
        if (!finalists || finalists.length === 0) {
            return res.status(400).json({ message: 'No finalists provided' });
        }

        const randomIndex = Math.floor(Math.random() * finalists.length);
        const winner = finalists[randomIndex];

        res.status(200).json(winner);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};