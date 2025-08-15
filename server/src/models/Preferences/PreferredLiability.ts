import mongoose from 'mongoose';

const preferredLiabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Liability' }],
});

const PreferredLiability = mongoose.model('PreferredLiabilities', preferredLiabilitySchema);
export default PreferredLiability;