const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  date: { type: Date, required: true },
  weightKg: Number,
  caloriesConsumed: Number,
  caloriesBurned: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProgressEntry', ProgressEntrySchema);
