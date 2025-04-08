import LotteryEvent from '../models/lotteryEvent.js';

export const createLotteryEvent = async (req, res) => {
    try {
        const { id, name, date } = req.body;
        const newEvent = new LotteryEvent({ id, name, date });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const drawWinners = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await LotteryEvent.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Implement the logic to draw winners
        // ...

        res.status(200).json({ message: 'Winners drawn' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
