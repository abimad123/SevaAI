const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createProject, getProjects, getProject, updateProject, updateProjectStatus, addMonitoringReport, getProjectsByNGO } = require('../controllers/projectController');

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/ngo/:ngoId', getProjectsByNGO);
router.get('/:id', getProject);
router.put('/:id', protect, updateProject);
router.put('/:id/status', protect, authorize('government_officer', 'system_admin'), updateProjectStatus);
router.post('/:id/reports', protect, addMonitoringReport);

module.exports = router;
