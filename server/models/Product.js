import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sisterId: String,
  name: String,
  artisan: String,
  state: String,
  category: String,
  price: Number,
  originalPrice: Number,
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  image: String,
  description: String,
  materials: String,
  dimensions: String,
  inStock: { type: Boolean, default: true }
});

export default mongoose.model('Product', productSchema);
