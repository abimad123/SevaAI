const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadDocument, getDocuments, getDocument, analyzeDocument, deleteDocument } = require('../controllers/documentController');

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.post('/:id/analyze', protect, analyzeDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
