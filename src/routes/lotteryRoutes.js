import express from 'express';
import { createLotteryEvent, drawWinners } from '../controllers/lotterycontroller.js';

const router = express.Router();

router.post('/create', createLotteryEvent); // Route to create a new lottery event
router.get('/draw/:eventId', drawWinners); // Route to draw winners for a specific event

export default router;
