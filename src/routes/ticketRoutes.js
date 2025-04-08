import express from 'express';
import multer from 'multer';
import path from 'path';
import { getTickets, purchaseTicket, getVerifiedTickets, getRandomWinners, selectFinalWinner } from '../controllers/ticketcontroller.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/tickets', getTickets);
router.get('/verified-tickets', getVerifiedTickets);
router.get('/random-winners', getRandomWinners);
router.post('/select-final-winner', selectFinalWinner);
router.post('/purchase', upload.single('paymentScreenshot'), purchaseTicket);

export default router;