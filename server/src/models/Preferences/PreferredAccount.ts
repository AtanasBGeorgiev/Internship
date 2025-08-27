import mongoose from 'mongoose';

const preferredAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
});

const PreferredAccount = mongoose.model('PreferredAccounts', preferredAccountSchema);
export default PreferredAccount;