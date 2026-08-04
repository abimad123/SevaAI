const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  type: {
    type: String,
    enum: ['registration_certificate', 'financial_report', 'project_report', 'government_form',
      'compliance_doc', 'proposal', 'impact_report', 'other'],
    default: 'other',
  },
  mimeType: { type: String },
  size: { type: Number },
  url: { type: String, required: true },
  path: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isPublic: { type: Boolean, default: false },
  aiAnalysis: {
    isAnalyzed: { type: Boolean, default: false },
    analyzedAt: Date,
    summary: String,
    keyInformation: [{ key: String, value: String }],
    missingInformation: [String],
    complianceIssues: [String],
    suggestions: [String],
    confidence: Number,
    rawResponse: mongoose.Schema.Types.Mixed,
  },
  tags: [String],
  expiryDate: Date,
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
