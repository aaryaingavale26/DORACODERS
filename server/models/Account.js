import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  provider: String,
  providerAccountId: String
});

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export default mongoose.model('Account', accountSchema);
