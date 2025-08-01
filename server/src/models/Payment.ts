import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentType: String,
  remmiterName: String,
  remmiterBankAccount: String,
  beneficiaryName: String,
  beneficiaryBankAccount: String,
  amount: Number,
  currency: String
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;