import mongoose from 'mongoose';

const StudySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 1
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.models.StudySession ||
  mongoose.model('StudySession', StudySessionSchema);
