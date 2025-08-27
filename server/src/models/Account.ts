import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name_bg: String,
  name_en: String,
  accountNumber: String,
  currency: String,
  avaiability: Number,
  openingBalance: Number,
  currentBalance: Number,
  feesDue: Number
});

const Account = mongoose.model('Account', accountSchema);
export default Account;