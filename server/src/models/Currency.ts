import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  currency: String,
  perUnit: Number,
  exchangeRate: Number,
  reverseRate: Number,
  name_bg: String,
  name_en: String,
  flagURL: String
});

const Currency = mongoose.model('Currency', currencySchema);
export default Currency;