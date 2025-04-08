import mongoose from 'mongoose';

const lotteryEventSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
});

const LotteryEvent = mongoose.model('LotteryEvent', lotteryEventSchema);

export default LotteryEvent;
