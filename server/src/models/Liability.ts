import mongoose from 'mongoose';

const liabilitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name_bg: String,
    name_en: String,
    Date: Date,
    autoPay: Boolean,
    amount: Number,
    feeType: { type: String, enum: ["electricity", "water", "heating", "phone", "other"] }
});

const Liability = mongoose.model('Liability', liabilitySchema);
export default Liability;