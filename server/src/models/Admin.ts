import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
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
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;