import mongoose from 'mongoose';

const preferredPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemsID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
});

const PreferredPayment = mongoose.model('PreferredPayments', preferredPaymentSchema);
export default PreferredPayment;