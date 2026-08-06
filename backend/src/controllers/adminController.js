const KnowledgeBaseDocument = require('../models/KnowledgeBaseDocument');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.uploadKnowledgeDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { title, category = 'General', state = 'All', language = 'en' } = req.body;
    const finalTitle = title || req.file.originalname;

    const existing = await KnowledgeBaseDocument.findOne({ source: req.file.originalname });
    if (existing) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'A document with this filename already exists in the Knowledge Base.' });
    }

    const kbDoc = await KnowledgeBaseDocument.create({
      title: finalTitle,
      source: req.file.originalname,
      category,
      state,
      language,
      path: req.file.path,
      size: req.file.size
    });

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/knowledge/ingest`, {
        file_path: path.resolve(req.file.path),
        title: finalTitle,
        source: req.file.originalname,
        category,
        state,
        language
      }, { timeout: 120000 });

      kbDoc.chunkCount = response.data.chunk_count || 0;
      await kbDoc.save();

      res.status(201).json({ success: true, data: kbDoc, message: 'Document ingested and indexed successfully.' });
    } catch (aiError) {
      await KnowledgeBaseDocument.findByIdAndDelete(kbDoc._id);
      fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, error: aiError.response?.data?.detail || aiError.message, message: 'Ingestion failed inside the AI Service.' });
    }
  } catch (error) { next(error); }
};

exports.getKnowledgeDocuments = async (req, res, next) => {
  try {
    const docs = await KnowledgeBaseDocument.find().sort({ uploadedAt: -1 });
    res.json({ success: true, data: docs });
  } catch (error) { next(error); }
};

exports.deleteKnowledgeDocument = async (req, res, next) => {
  try {
    const doc = await KnowledgeBaseDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    try {
      await axios.delete(`${AI_SERVICE_URL}/api/knowledge/delete`, {
        data: { source: doc.source },
        timeout: 30000
      });
    } catch (aiError) {
      return res.status(500).json({ success: false, error: aiError.response?.data?.detail || aiError.message, message: 'Failed to delete index in AI Service.' });
    }

    if (fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }

    await KnowledgeBaseDocument.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document deleted successfully from store and vector index.' });
  } catch (error) { next(error); }
};

exports.rebuildEmbeddings = async (req, res, next) => {
  try {
    const docs = await KnowledgeBaseDocument.find();
    const docList = docs.map(d => ({
      file_path: path.resolve(d.path),
      title: d.title,
      source: d.source,
      category: d.category,
      state: d.state,
      language: d.language
    }));

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/knowledge/rebuild`, {
        documents: docList
      }, { timeout: 240000 });

      for (const item of response.data.results || []) {
        await KnowledgeBaseDocument.findOneAndUpdate(
          { source: item.source },
          { chunkCount: item.chunk_count }
        );
      }

      res.json({ success: true, message: 'Embeddings rebuilt successfully.', count: response.data.total_chunks });
    } catch (aiError) {
      res.status(500).json({ success: false, error: aiError.response?.data?.detail || aiError.message, message: 'Rebuilding vectors failed in the AI Service.' });
    }
  } catch (error) { next(error); }
};

exports.getEmbeddingStatistics = async (req, res, next) => {
  try {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/knowledge/statistics`, { timeout: 15000 });
      res.json({ success: true, data: response.data });
    } catch (aiError) {
      res.status(500).json({ success: false, error: aiError.response?.data?.detail || aiError.message, message: 'Failed to retrieve statistics from AI Service.' });
    }
  } catch (error) { next(error); }
};
