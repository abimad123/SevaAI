const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', default: null },
  description: { type: String, required: true },
  objectives: [String],
  targetGroup: { type: String },
  category: { type: String },
  focusAreas: [String],
  location: {
    state: String,
    district: String,
    city: String,
    villages: [String],
  },
  timeline: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    phases: [{
      name: String,
      description: String,
      startDate: Date,
      endDate: Date,
      status: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'planned' },
    }],
  },
  budget: {
    total: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    remaining: { type: Number },
    currency: { type: String, default: 'INR' },
    breakdown: [{
      category: String,
      amount: Number,
      description: String,
    }],
  },
  funding: [{
    source: String,
    type: { type: String, enum: ['government_grant', 'csr', 'donor', 'self', 'other'] },
    amount: Number,
    status: { type: String, enum: ['applied', 'approved', 'received', 'rejected'] },
  }],
  team: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String,
    responsibilities: String,
  }],
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completedDate: Date,
    status: { type: String, enum: ['pending', 'achieved', 'missed'], default: 'pending' },
    metrics: mongoose.Schema.Types.Mixed,
  }],
  impact: {
    beneficiariesTargeted: Number,
    beneficiariesReached: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    metrics: [{
      name: String,
      target: Number,
      achieved: Number,
      unit: String,
    }],
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'active', 'completed', 'suspended', 'rejected'],
    default: 'draft',
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  completionReport: String,
  monitoringReports: [{
    reportDate: Date,
    summary: String,
    attachmentUrl: String,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  tags: [String],
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
