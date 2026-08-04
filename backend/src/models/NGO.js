const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, unique: true, trim: true },
  registrationType: {
    type: String,
    enum: ['trust', 'society', 'section_8', 'fcra', 'other'],
    default: 'trust',
  },
  pan: { type: String, trim: true },
  cin: { type: String, trim: true },
  establishedYear: { type: Number },
  description: { type: String, maxlength: 2000 },
  mission: { type: String },
  vision: { type: String },
  focusAreas: [{ type: String }], // e.g., ['education', 'health', 'women_empowerment']
  location: {
    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  operationalStates: [String],
  contactPerson: {
    name: String,
    designation: String,
    email: String,
    phone: String,
  },
  website: String,
  email: { type: String, lowercase: true },
  phone: String,
  teamSize: { type: Number, default: 0 },
  volunteerCount: { type: Number, default: 0 },
  beneficiaryCount: { type: Number, default: 0 },
  annualBudget: { type: Number, default: 0 },
  fundingRequirement: { type: Number, default: 0 },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    documentUrl: String,
  }],
  previousProjects: [{
    name: String,
    description: String,
    year: Number,
    impact: String,
    fundingAmount: Number,
  }],
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending',
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  impactScore: { type: Number, default: 0, min: 0, max: 100 },
  tags: [String],
}, { timestamps: true });

ngoSchema.index({ name: 'text', description: 'text', focusAreas: 'text' });

module.exports = mongoose.model('NGO', ngoSchema);
