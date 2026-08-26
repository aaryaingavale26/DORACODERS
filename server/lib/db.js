import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/udaan';
    await mongoose.connect(connString);
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
