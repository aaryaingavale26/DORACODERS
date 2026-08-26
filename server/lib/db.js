import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/doracoders';
    await mongoose.connect(connString, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB Atlas / Database successfully.');
  } catch (err) {
    console.warn('MongoDB connection warning:', err.message);
    // Don't crash process so server can still serve fallback endpoints
  }
};

export default connectDB;
