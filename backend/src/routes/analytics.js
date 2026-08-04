const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOverview, getNGOAnalytics, getFundingMatch } = require('../controllers/analyticsController');

router.get('/overview', protect, getOverview);
router.get('/ngo/:ngoId', protect, getNGOAnalytics);
router.post('/funding-match', protect, getFundingMatch);

module.exports = router;
