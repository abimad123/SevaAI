const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { getSchemes, getScheme, createScheme, updateScheme, deleteScheme, getCategories } = require('../controllers/schemeController');

router.get('/', optionalAuth, getSchemes);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getScheme);
router.post('/', protect, authorize('government_officer', 'system_admin'), createScheme);
router.put('/:id', protect, authorize('government_officer', 'system_admin'), updateScheme);
router.delete('/:id', protect, authorize('system_admin'), deleteScheme);

module.exports = router;
