const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMessage, getSessions, getSession, deleteSession, submitFeedback, generateProposal, renameSession, getProposalHistory, getProposalById } = require('../controllers/chatController');

router.post('/message', protect, sendMessage);
router.get('/sessions', protect, getSessions);
router.get('/sessions/:sessionId', protect, getSession);
router.delete('/sessions/:sessionId', protect, deleteSession);
router.put('/sessions/:sessionId', protect, renameSession);
router.post('/feedback', protect, submitFeedback);
router.post('/generate-proposal', protect, generateProposal);
router.get('/proposals/history', protect, getProposalHistory);
router.get('/proposals/:id', protect, getProposalById);

module.exports = router;
