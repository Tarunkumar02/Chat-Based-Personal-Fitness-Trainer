const mongoose = require('mongoose');

const WorkoutLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  date: { type: Date, required: true },
  durationMinutes: Number,
  type: String, // 'strength' | 'cardio' | 'yoga' | custom
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weightKg: Number,
      durationSec: Number,
      notes: String
    }
  ],
  caloriesBurned: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);
