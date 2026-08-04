const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createNGO, getNGOs, getNGO, updateNGO, verifyNGO, getMyNGO, getNGOStats } = require('../controllers/ngoController');

router.get('/', getNGOs);
router.post('/', protect, authorize('ngo_admin', 'system_admin'), createNGO);
router.get('/my', protect, authorize('ngo_admin'), getMyNGO);
router.get('/:id', getNGO);
router.put('/:id', protect, updateNGO);
router.put('/:id/verify', protect, authorize('government_officer', 'system_admin'), verifyNGO);
router.get('/:id/stats', protect, getNGOStats);

module.exports = router;
