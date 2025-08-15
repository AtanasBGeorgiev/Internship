import mongoose from 'mongoose';

const preferredDepositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deposit' }],
});

const PreferredDeposit = mongoose.model('PreferredDeposits', preferredDepositSchema);
export default PreferredDeposit;