const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please provide email and password' }
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        ok: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      passwordHash
    });

    if (user) {
      res.status(201).json({
        ok: true,
        data: {
          id: user._id,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        ok: true,
        data: {
          token: generateToken(user._id),
          user: {
            id: user._id,
            email: user.email,
            profile: user.profile
          }
        }
      });
    } else {
      res.status(401).json({
        ok: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    ok: true,
    data: {
      id: req.user._id,
      email: req.user.email,
      profile: req.user.profile,
      settings: req.user.settings
    }
  });
};

module.exports = { register, login, getMe };
