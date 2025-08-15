import mongoose from 'mongoose';

const preferredCurrencySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Currency' }]
}
);

const PreferredCurrency = mongoose.model('PreferredCurrency', preferredCurrencySchema);
export default PreferredCurrency;