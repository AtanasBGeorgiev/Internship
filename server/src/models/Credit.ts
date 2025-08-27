import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    name_bg: String,
    name_en: String,
    amount: Number,
    currency: String,
    interestRate: Number,
    installmentDue: Number,
    installmentDueDate: Date,
    maturity: Date
});

const Credit = mongoose.model('Credit', creditSchema);
export default Credit;