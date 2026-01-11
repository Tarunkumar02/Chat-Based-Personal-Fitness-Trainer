const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createWorkout)
  .get(protect, getWorkouts);

router.route('/:id')
  .delete(protect, deleteWorkout);

module.exports = router;
