import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  accountNumber: String,
  currency: String,
  avaiability: Number,
  openingBalance: Number,
  currentBalance: Number,
  feesDue: Number
});

const Account = mongoose.model('Account', accountSchema);
export default Account;