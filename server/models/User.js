const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Onboarding/profile fields
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    heightCm: { type: Number },
    weightKg: { type: Number },
    activityLevel: { type: String }, // sedentary, light, moderate, active
    goals: [{ type: String }], // weight loss, muscle gain, endurance, etc.
    dietaryPreferences: {
      type: { type: String }, // veg/non-veg/vegan
      allergies: [String],
      preferencesNotes: String
    },
    fitnessLevel: { type: String }, // beginner/intermediate/advanced
    updatedAt: { type: Date, default: Date.now }
  },
  settings: {
    units: { type: String, default: 'metric' }
  }
});

module.exports = mongoose.model('User', UserSchema);
