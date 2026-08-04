const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');
const { v4: uuidv4 } = require('uuid');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @desc Send message to AI assistant
// @route POST /api/chat/message
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
        title: message.substring(0, 60),
        language,
        messages: [],
        context,
      });
    }

    // Add user message
    chatSession.messages.push({ role: 'user', content: message, language });
    chatSession.lastMessageAt = new Date();

    let aiResponse;
    const startTime = Date.now();

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
        message,
        language,
        context,
        history: chatSession.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        user_role: req.user.role,
      }, { timeout: 30000 });
      aiResponse = response.data;
    } catch (aiError) {
      // Fallback response when AI service is not running
      aiResponse = {
        response: generateFallbackResponse(message, language),
        sources: [],
        confidence: 0.5,
        processing_time: Date.now() - startTime,
      };
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

// @desc Get chat sessions list
// @route GET /api/chat/sessions
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatHistory.find({ userId: req.user._id, isActive: true })
      .select('sessionId title lastMessageAt messages language')
      .sort({ lastMessageAt: -1 })
      .limit(20);
    res.json({ success: true, data: sessions });
  } catch (error) { next(error); }
};

// @desc Get single chat session
// @route GET /api/chat/sessions/:sessionId
exports.getSession = async (req, res, next) => {
  try {
    const session = await ChatHistory.findOne({ userId: req.user._id, sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, data: session });
  } catch (error) { next(error); }
};

// @desc Delete chat session
// @route DELETE /api/chat/sessions/:sessionId
exports.deleteSession = async (req, res, next) => {
  try {
    await ChatHistory.findOneAndUpdate({ userId: req.user._id, sessionId: req.params.sessionId }, { isActive: false });
    res.json({ success: true, message: 'Session deleted.' });
  } catch (error) { next(error); }
};

// @desc Submit message feedback
// @route POST /api/chat/feedback
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

// @desc Generate proposal using AI
// @route POST /api/chat/generate-proposal
exports.generateProposal = async (req, res, next) => {
  try {
    const { projectName, location, budget, targetGroup, duration, description, focusArea } = req.body;
    let proposal;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/proposal`, {
        project_name: projectName, location, budget, target_group: targetGroup,
        duration, description, focus_area: focusArea,
      }, { timeout: 60000 });
      proposal = response.data;
    } catch {
      proposal = generateFallbackProposal({ projectName, location, budget, targetGroup, duration });
    }
    res.json({ success: true, data: proposal });
  } catch (error) { next(error); }
};

// Fallback response when AI service is not available
function generateFallbackResponse(message, language) {
  const responses = {
    en: `Thank you for your question about "${message.substring(0, 50)}...". The SevaAI assistant is ready to help you navigate government schemes, NGO management, and social impact initiatives. Please ensure the AI service is running for full RAG-powered responses with document sources.`,
    hi: `आपके प्रश्न के लिए धन्यवाद। SevaAI सहायक सरकारी योजनाओं, NGO प्रबंधन और सामाजिक प्रभाव पहलों में आपकी सहायता के लिए तैयार है।`,
  };
  return responses[language] || responses.en;
}

function generateFallbackProposal({ projectName, location, budget, targetGroup, duration }) {
  return {
    title: projectName,
    executive_summary: `This project aims to create meaningful impact in ${location} targeting ${targetGroup} over a period of ${duration}.`,
    objectives: ['Improve living standards', 'Build community capacity', 'Ensure sustainable impact'],
    timeline: `${duration} implementation plan with quarterly reviews`,
    budget_breakdown: `Total budget of ₹${budget} allocated across personnel (40%), materials (30%), operations (20%), and contingency (10%)`,
    expected_impact: 'Measurable improvements in beneficiary outcomes with documented evidence',
    monitoring_strategy: 'Monthly progress reports, quarterly assessments, and annual impact evaluations',
  };
}
