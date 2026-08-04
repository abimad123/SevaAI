const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMessage, getSessions, getSession, deleteSession, submitFeedback, generateProposal } = require('../controllers/chatController');

router.post('/message', protect, sendMessage);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:sessionId', protect, getSession);
router.delete('/sessions/:sessionId', protect, deleteSession);
router.post('/feedback', protect, submitFeedback);
router.post('/generate-proposal', protect, generateProposal);

module.exports = router;
