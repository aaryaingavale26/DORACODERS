import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  profileImage: String,
  phone: String, // Real contact phone number
  role: { type: String, enum: ['buyer', 'sister'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
