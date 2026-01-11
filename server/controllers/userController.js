const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      ok: true,
      data: user.profile || {}
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Update user profile (onboarding)
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goals,
      dietaryPreferences,
      fitnessLevel
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      });
    }

    // Update profile fields
    user.profile = {
      ...user.profile,
      firstName: firstName || user.profile?.firstName,
      lastName: lastName || user.profile?.lastName,
      age: age || user.profile?.age,
      gender: gender || user.profile?.gender,
      heightCm: heightCm || user.profile?.heightCm,
      weightKg: weightKg || user.profile?.weightKg,
      activityLevel: activityLevel || user.profile?.activityLevel,
      goals: goals || user.profile?.goals,
      dietaryPreferences: dietaryPreferences || user.profile?.dietaryPreferences,
      fitnessLevel: fitnessLevel || user.profile?.fitnessLevel,
      updatedAt: Date.now()
    };

    await user.save();

    res.json({
      ok: true,
      data: user.profile
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

module.exports = { getProfile, updateProfile };
