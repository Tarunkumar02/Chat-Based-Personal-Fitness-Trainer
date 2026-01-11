const rateLimit = require('express-rate-limit');

// Rate limiter for chat endpoint: 60 requests per hour per user
const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60, // 60 requests per window
  keyGenerator: (req) => req.user ? req.user._id.toString() : req.ip,
  message: {
    ok: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { chatLimiter };
