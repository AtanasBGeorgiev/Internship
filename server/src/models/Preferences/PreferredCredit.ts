import mongoose from 'mongoose';

const preferredCreditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Credit' }],
});

const PreferredCredit = mongoose.model('PreferredCredits', preferredCreditSchema);
export default PreferredCredit;