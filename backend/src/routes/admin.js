const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadKnowledgeDocument, getKnowledgeDocuments, deleteKnowledgeDocument, rebuildEmbeddings, getEmbeddingStatistics } = require('../controllers/adminController');

router.use(protect);
router.use(authorize('system_admin'));

router.post('/upload', upload.single('file'), uploadKnowledgeDocument);
router.get('/documents', getKnowledgeDocuments);
router.delete('/documents/:id', deleteKnowledgeDocument);
router.post('/rebuild', rebuildEmbeddings);
router.get('/statistics', getEmbeddingStatistics);

module.exports = router;
