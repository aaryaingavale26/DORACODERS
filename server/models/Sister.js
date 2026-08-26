import mongoose from 'mongoose';

const sisterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  name: String,
  specialty: String,
  category: String,
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 0 },
  rate: Number,
  rateUnit: String,
  likes: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  subscription: { type: String, default: 'free' },
  avatar: String,
  distance: String,
  distanceKm: Number,
  location: String,
  experience: String,
  phone: String,
  availableDays: [String],
  timeSlots: [String],
  services: [{
    id: String,
    name: String,
    price: Number,
    duration: String
  }],
  badges: [String],
  enrolledDate: { type: Date, default: Date.now }
});

export default mongoose.model('Sister', sisterSchema);
