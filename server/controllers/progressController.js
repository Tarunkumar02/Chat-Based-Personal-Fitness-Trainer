const ProgressEntry = require('../models/ProgressEntry');
const WorkoutLog = require('../models/WorkoutLog');

// @desc    Create progress entry
// @route   POST /api/progress
// @access  Private
const createProgress = async (req, res) => {
  try {
    const { date, weightKg, caloriesConsumed, caloriesBurned, notes } = req.body;

    const entry = await ProgressEntry.create({
      userId: req.user._id,
      date: date || new Date(),
      weightKg,
      caloriesConsumed,
      caloriesBurned,
      notes
    });

    res.status(201).json({
      ok: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get progress entries
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { userId: req.user._id };

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const entries = await ProgressEntry.find(query).sort({ date: 1 });
    res.json({
      ok: true,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get chart data (aggregated)
// @route   GET /api/progress/chart
// @access  Private
const getChartData = async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = req.user._id;

    // Build date query
    const dateQuery = {};
    if (from) dateQuery.$gte = new Date(from);
    if (to) dateQuery.$lte = new Date(to);

    // Get progress entries
    const progressQuery = { userId };
    if (Object.keys(dateQuery).length) progressQuery.date = dateQuery;
    const progressEntries = await ProgressEntry.find(progressQuery).sort({ date: 1 });

    // Get workout logs and aggregate by date
    const workoutQuery = { userId };
    if (Object.keys(dateQuery).length) workoutQuery.date = dateQuery;
    const workouts = await WorkoutLog.find(workoutQuery);

    // Aggregate workouts by date
    const workoutsByDate = {};
    workouts.forEach(w => {
      const dateKey = new Date(w.date).toISOString().split('T')[0];
      if (!workoutsByDate[dateKey]) {
        workoutsByDate[dateKey] = { count: 0, caloriesBurned: 0 };
      }
      workoutsByDate[dateKey].count++;
      workoutsByDate[dateKey].caloriesBurned += w.caloriesBurned || 0;
    });

    // Merge data for chart
    const chartData = [];
    const dateSet = new Set();

    // Add progress entry dates
    progressEntries.forEach(p => {
      const dateKey = new Date(p.date).toISOString().split('T')[0];
      dateSet.add(dateKey);
    });

    // Add workout dates
    Object.keys(workoutsByDate).forEach(d => dateSet.add(d));

    // Create sorted chart data
    Array.from(dateSet).sort().forEach(dateKey => {
      const progress = progressEntries.find(
        p => new Date(p.date).toISOString().split('T')[0] === dateKey
      );
      const workout = workoutsByDate[dateKey];

      chartData.push({
        date: dateKey,
        weightKg: progress?.weightKg || null,
        workouts: workout?.count || 0,
        caloriesBurned: (progress?.caloriesBurned || 0) + (workout?.caloriesBurned || 0),
        caloriesConsumed: progress?.caloriesConsumed || null
      });
    });

    res.json({
      ok: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

module.exports = { createProgress, getProgress, getChartData };
