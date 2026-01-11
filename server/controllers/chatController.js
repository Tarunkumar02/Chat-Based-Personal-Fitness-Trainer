const ChatMessage = require('../models/ChatMessage');
const Plan = require('../models/Plan');
const { callGemini } = require('../services/geminiService');
const { validatePlanJSON } = require('../services/planValidator');

// @desc    Send a chat message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user._id;
    const userProfile = req.user.profile;

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: 'Message is required' }
      });
    }

    // Save user message
    await ChatMessage.create({
      userId,
      role: 'user',
      content: message,
      metadata: context
    });

    // Call Gemini
    const geminiResponse = await callGemini(message, userProfile);

    if (!geminiResponse.success) {
      // Save error response
      await ChatMessage.create({
        userId,
        role: 'assistant',
        content: 'I apologize, but I encountered an error generating your plan. Please try again.',
        metadata: { error: geminiResponse.error }
      });

      return res.status(500).json({
        ok: false,
        error: { code: 'LLM_FAILURE', message: 'Failed to generate plan. Please try again.' }
      });
    }

    // Validate the plan JSON
    const validation = validatePlanJSON(geminiResponse.data);

    let planId = null;
    let planJSON = null;

    if (validation.valid) {
      // Save the plan
      const plan = await Plan.create({
        userId,
        promptSnapshot: message,
        planJSON: geminiResponse.data
      });
      planId = plan._id;
      planJSON = geminiResponse.data;
    }

    // Create assistant response text
    const assistantText = validation.valid
      ? "Here's your personalized fitness plan! Click 'View Plan' to see the details."
      : "I've created some suggestions for you, but some details might need clarification.";

    // Save assistant message
    await ChatMessage.create({
      userId,
      role: 'assistant',
      content: assistantText,
      metadata: { planId, validationErrors: validation.errors }
    });

    res.json({
      ok: true,
      data: {
        assistantText,
        planId,
        planJSON
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      ok: true,
      data: messages.reverse()
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get all plans
// @route   GET /api/plans
// @access  Private
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// @desc    Get a single plan
// @route   GET /api/plans/:id
// @access  Private
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) {
      return res.status(404).json({
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Plan not found' }
      });
    }
    res.json({
      ok: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

module.exports = { sendMessage, getChatHistory, getPlans, getPlanById };
