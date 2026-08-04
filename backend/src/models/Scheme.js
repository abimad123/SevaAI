const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  schemeCode: { type: String, unique: true, sparse: true },
  department: { type: String, required: true },
  ministry: { type: String },
  level: { type: String, enum: ['central', 'state', 'district'], default: 'central' },
  state: { type: String }, // null means all India
  description: { type: String, required: true, maxlength: 5000 },
  shortDescription: { type: String, maxlength: 500 },
  category: {
    type: String,
    enum: ['education', 'health', 'women_empowerment', 'rural_development', 'skill_development',
      'agriculture', 'environment', 'social_welfare', 'housing', 'livelihood', 'children', 'elderly', 'disability', 'other'],
    required: true,
  },
  focusAreas: [String],
  eligibility: {
    description: String,
    targetGroup: [String],
    incomeLimit: Number,
    ageMin: Number,
    ageMax: Number,
    gender: { type: String, enum: ['all', 'male', 'female', 'other'], default: 'all' },
    ngoEligible: { type: Boolean, default: true },
    requiredCertifications: [String],
  },
  benefits: {
    description: String,
    financialAmount: Number,
    financialType: { type: String, enum: ['grant', 'loan', 'subsidy', 'scholarship', 'other'] },
    nonFinancialBenefits: [String],
  },
  applicationProcess: {
    description: String,
    steps: [String],
    onlineUrl: String,
    officeAddress: String,
    contactEmail: String,
    contactPhone: String,
  },
  requiredDocuments: [String],
  deadline: {
    isOngoing: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  fundingAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  tags: [String],
  isActive: { type: Boolean, default: true },
  applicationCount: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

schemeSchema.index({ name: 'text', description: 'text', category: 'text', focusAreas: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
