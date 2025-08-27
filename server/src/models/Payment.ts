import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentType: String,
  remmiterName_bg: String,
  remmiterName_en: String,
  remmiterBankAccount: String,
  beneficiaryName_bg: String,
  beneficiaryName_en: String,
  beneficiaryBankAccount: String,
  amount: Number,
  currency: String
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;