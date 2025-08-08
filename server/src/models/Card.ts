import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cardNumber: String,
  type: String,
  currency: String,
  balance: Number,
  liabilities: Number,
  minPayment: Number,
  repaymentDate: Date,
  ThreeDSecurity: { type: Boolean, default: false }
});

const Card = mongoose.model('Card', cardSchema);
export default Card;