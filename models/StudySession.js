import mongoose from 'mongoose';

const StudySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.StudySession || mongoose.model('StudySession', StudySessionSchema);
