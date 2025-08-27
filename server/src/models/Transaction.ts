import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    depositID: { type: mongoose.Schema.Types.ObjectId, ref: 'Deposit' },
    type: { type: String, enum: ["income", "expense"] },
    date: Date,
    document: String,
    reference_bg: String,
    reference_en: String,
    beneficiaryRemmiter_bg: String,
    beneficiaryRemmiter_en: String,
    account: String,
    amount: Number,
    currency: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;