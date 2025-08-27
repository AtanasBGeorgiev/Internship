import mongoose from 'mongoose';

const businessClientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name_bg: String,
  name_en: String
});

const BusinessClient = mongoose.model('BusinessClient', businessClientSchema);
export default BusinessClient;