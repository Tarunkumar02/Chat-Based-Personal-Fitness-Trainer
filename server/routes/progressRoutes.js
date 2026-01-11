const express = require('express');
const router = express.Router();
const { createProgress, getProgress, getChartData } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createProgress)
  .get(protect, getProgress);

router.get('/chart', protect, getChartData);

module.exports = router;
