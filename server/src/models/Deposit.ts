import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name_bg: String,
    name_en: String,
    number: String,
    currency: String,
    availability: Number,
    accruedInterest: Number,
    maturityDate: Date
});

const Deposit = mongoose.model('Deposit', depositSchema);
export default Deposit;