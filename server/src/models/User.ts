import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: String,
  egn: String,
  passport: String,
  nameCyrillic: String,
  nameLatin: String,
  email: String,
  phone: String,
  address: String,
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);
export default User;