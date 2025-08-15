import mongoose from 'mongoose';

const preferredCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
});

const PreferredCard = mongoose.model('PreferredCards', preferredCardSchema);
export default PreferredCard;