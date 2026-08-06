const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');
const Proposal = require('../models/Proposal');
const { v4: uuidv4 } = require('uuid');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId, language = 'en', context = {} } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });

    const sid = sessionId || uuidv4();
    let chatSession = await ChatHistory.findOne({ userId: req.user._id, sessionId: sid });
    if (!chatSession) {
      chatSession = await ChatHistory.create({
        userId: req.user._id,
        sessionId: sid,
        conversationId: sid,
        role: req.user.role || 'citizen',
        title: message.substring(0, 60),
        language,
        messages: [],
        context,
      });
    }

    chatSession.messages.push({ role: 'user', content: message, language });
    chatSession.lastMessageAt = new Date();

    const startTime = Date.now();
    let aiResponse;

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
        message,
        language,
        context,
        history: chatSession.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        user_role: req.user.role || 'citizen',
      }, { timeout: 30000 });
      aiResponse = response.data;
    } catch (aiError) {
      return res.status(500).json({
        success: false,
        error: aiError.response?.data?.detail || aiError.message
      });
    }

    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.response,
      sources: aiResponse.sources || [],
      confidence: aiResponse.confidence || 0.7,
      language,
      processingTime: Date.now() - startTime,
    };

    chatSession.messages.push(assistantMessage);
    await chatSession.save();

    res.json({
      success: true,
      data: {
        sessionId: sid,
        message: assistantMessage,
        chatId: chatSession._id,
      },
    });
  } catch (error) { next(error); }
};

exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user._id, isActive: true })
      .select('sessionId title lastMessageAt messages language')
      .sort({ lastMessageAt: -1 })
      .limit(20);
    res.json({ success: true, data: sessions });
  } catch (error) { next(error); }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await ChatHistory.findOne({ userId: req.user._id, sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, data: session });
  } catch (error) { next(error); }
};

exports.deleteSession = async (req, res, next) => {
  try {
    await ChatHistory.findOneAndUpdate({ userId: req.user._id, sessionId: req.params.sessionId }, { isActive: false });
    res.json({ success: true, message: 'Session deleted.' });
  } catch (error) { next(error); }
};

exports.renameSession = async (req, res, next) => {
  try {
    const { title } = req.body;
    await ChatHistory.findOneAndUpdate({ userId: req.user._id, sessionId: req.params.sessionId }, { title });
    res.json({ success: true, message: 'Session renamed.' });
  } catch (error) { next(error); }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const { sessionId, messageIndex, rating, helpful, comment } = req.body;
    const session = await ChatHistory.findOne({ userId: req.user._id, sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    if (session.messages[messageIndex]) {
      session.messages[messageIndex].feedback = { rating, helpful, comment };
      await session.save();
    }
    res.json({ success: true, message: 'Feedback submitted.' });
  } catch (error) { next(error); }
};

exports.generateProposal = async (req, res, next) => {
  try {
    const { projectName, location, budget, targetGroup, duration, description, focusArea } = req.body;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/proposal`, {
        project_name: projectName, location, budget, target_group: targetGroup,
        duration, description, focus_area: focusArea,
      }, { timeout: 120000 });

      const proposal = await Proposal.create({
        userId: req.user._id,
        ngoId: req.user.ngoId,
        projectName,
        location,
        budget: parseFloat(budget) || 0,
        targetGroup,
        duration,
        focusArea,
        description,
        title: response.data.title || projectName,
        executive_summary: response.data.executive_summary,
        objectives: response.data.objectives,
        timeline: response.data.timeline,
        budget_breakdown: response.data.budget_breakdown,
        monitoring_strategy: response.data.monitoring_strategy,
        expected_impact: response.data.expected_impact,
        proposal_text: response.data.proposal_text,
        sources: response.data.sources || []
      });

      res.json({ success: true, data: proposal });
    } catch (aiError) {
      return res.status(500).json({
        success: false,
        error: aiError.response?.data?.detail || aiError.message
      });
    }
  } catch (error) { next(error); }
};

exports.getProposalHistory = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ userId: req.user._id }).sort({ generatedAt: -1 }).select('title projectName focusArea location generatedAt');
    res.json({ success: true, data: proposals });
  } catch (error) { next(error); }
};

exports.getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found.' });
    res.json({ success: true, data: proposal });
  } catch (error) { next(error); }
};
