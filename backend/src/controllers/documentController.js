const Document = require('../models/Document');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @desc Upload document
// @route POST /api/documents/upload
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const doc = await Document.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      type: req.body.type || 'other',
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.user._id}/${req.file.filename}`,
      path: req.file.path,
      uploadedBy: req.user._id,
      ngoId: req.body.ngoId || req.user.ngoId,
      projectId: req.body.projectId,
      isPublic: req.body.isPublic === 'true',
      tags: req.body.tags ? req.body.tags.split(',') : [],
    });

    // Trigger async AI analysis
    triggerAIAnalysis(doc._id, req.file.path).catch(console.error);

    res.status(201).json({ success: true, data: doc, message: 'Document uploaded. AI analysis in progress.' });
  } catch (error) { next(error); }
};

async function triggerAIAnalysis(docId, filePath) {
  try {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('document_id', docId.toString());

    const response = await axios.post(`${AI_SERVICE_URL}/api/document/analyze`, form, {
      headers: form.getHeaders(),
      timeout: 120000,
    });

    await Document.findByIdAndUpdate(docId, {
      'aiAnalysis.isAnalyzed': true,
      'aiAnalysis.analyzedAt': new Date(),
      'aiAnalysis.summary': response.data.summary,
      'aiAnalysis.keyInformation': response.data.key_information || [],
      'aiAnalysis.missingInformation': response.data.missing_information || [],
      'aiAnalysis.complianceIssues': response.data.compliance_issues || [],
      'aiAnalysis.suggestions': response.data.suggestions || [],
      'aiAnalysis.confidence': response.data.confidence || 0.7,
    });
  } catch {
    await Document.findByIdAndUpdate(docId, {
      'aiAnalysis.isAnalyzed': true,
      'aiAnalysis.analyzedAt': new Date(),
      'aiAnalysis.summary': 'Document has been uploaded and stored. AI analysis requires the AI service to be running.',
      'aiAnalysis.confidence': 0,
    });
  }
}

// @desc Get documents
// @route GET /api/documents
exports.getDocuments = async (req, res, next) => {
  try {
    const { ngoId, projectId, type, page = 1, limit = 10 } = req.query;
    const query = { isDeleted: false };

    if (ngoId) query.ngoId = ngoId;
    else if (req.user.ngoId) query.ngoId = req.user.ngoId;
    if (projectId) query.projectId = projectId;
    if (type) query.type = type;

    if (!['system_admin', 'government_officer'].includes(req.user.role)) {
      query.uploadedBy = req.user._id;
    }

    const total = await Document.countDocuments(query);
    const docs = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name');

    res.json({ success: true, data: docs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

// @desc Get single document
// @route GET /api/documents/:id
exports.getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate('uploadedBy', 'name');
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    res.json({ success: true, data: doc });
  } catch (error) { next(error); }
};

// @desc Re-analyze document
// @route POST /api/documents/:id/analyze
exports.analyzeDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found.' });
    triggerAIAnalysis(doc._id, doc.path).catch(console.error);
    res.json({ success: true, message: 'AI analysis triggered.' });
  } catch (error) { next(error); }
};

// @desc Delete document
// @route DELETE /api/documents/:id
exports.deleteDocument = async (req, res, next) => {
  try {
    await Document.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: 'Document deleted.' });
  } catch (error) { next(error); }
};
