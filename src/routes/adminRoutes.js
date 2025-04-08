import express from 'express';
import { verifyTicket, getPendingTickets, rejectTicket } from '../controllers/admincontroller.js';

const router = express.Router();

router.get('/pending-tickets', getPendingTickets); // Route to get pending tickets
router.patch('/verify-ticket/:ticketId', verifyTicket);
router.delete('/reject-ticket/:ticketId', rejectTicket);

export default router;
