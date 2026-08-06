const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  projectName: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  targetGroup: { type: String, required: true },
  duration: { type: String, required: true },
  focusArea: { type: String },
  description: { type: String },
  title: { type: String, required: true },
  executive_summary: { type: String },
  objectives: [String],
  timeline: { type: String },
  budget_breakdown: { type: String },
  monitoring_strategy: { type: String },
  expected_impact: { type: String },
  proposal_text: { type: String },
  sources: [{
    source: String,
    title: String,
    relevanceScore: Number
  }],
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);
