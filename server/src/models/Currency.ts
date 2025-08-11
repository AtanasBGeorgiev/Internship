import mongoose from 'mongoose';

const currencyItem = new mongoose.Schema({
  currency: String,
  reverseRate: Number
});

const currencySchema = new mongoose.Schema({
  data: [currencyItem]
});

const Currency = mongoose.model('Currency', currencySchema);
export default Currency;