const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  source: { type: String, default: 'gemini' },
  promptSnapshot: { type: String },
  planJSON: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Plan', PlanSchema);
