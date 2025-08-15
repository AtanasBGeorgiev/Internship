import mongoose from 'mongoose';

const preferredTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [String]
});

const PreferredTransaction = mongoose.model('PreferredTransaction', preferredTransactionSchema);
export default PreferredTransaction;