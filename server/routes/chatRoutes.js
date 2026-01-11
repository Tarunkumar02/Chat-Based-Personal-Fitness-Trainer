const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getPlans, getPlanById } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimitMiddleware');

// Chat routes
router.post('/', protect, chatLimiter, sendMessage);
router.get('/history', protect, getChatHistory);

// Plans routes
router.get('/plans', protect, getPlans);
router.get('/plans/:id', protect, getPlanById);

module.exports = router;
