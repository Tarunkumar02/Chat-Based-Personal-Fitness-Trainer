const WorkoutLog = require('../models/WorkoutLog');

// @desc    Create workout log
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const { date, durationMinutes, type, exercises, caloriesBurned } = req.body;

    const workout = await WorkoutLog.create({
      userId: req.user._id,
      date: date || new Date(),
      durationMinutes,
      type,
      exercises,
      caloriesBurned
    });

    res.status(201).json({
      ok: true,
      data: workout
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get workout logs
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { userId: req.user._id };

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const workouts = await WorkoutLog.find(query).sort({ date: -1 });
    res.json({
      ok: true,
      data: workouts
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Delete workout log
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await WorkoutLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Workout not found' }
      });
    }

    res.json({
      ok: true,
      data: { message: 'Workout deleted' }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

module.exports = { createWorkout, getWorkouts, deleteWorkout };
