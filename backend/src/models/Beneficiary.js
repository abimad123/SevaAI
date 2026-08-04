const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  phone: String,
  email: String,
  aadhaarHash: { type: String, select: false }, // stored as hash for privacy
  location: {
    address: String,
    village: String,
    district: String,
    state: String,
    pincode: String,
  },
  category: [{ type: String }], // e.g., ['bpl', 'sc', 'st', 'disabled', 'woman', 'child']
  incomeLevel: { type: String, enum: ['bpl', 'low', 'middle', 'other'] },
  language: { type: String, enum: ['en', 'hi', 'other'], default: 'hi' },
  enrolledSchemes: [{
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    enrolledDate: Date,
    status: { type: String, enum: ['applied', 'approved', 'receiving', 'completed', 'rejected'] },
  }],
  associatedNGOs: [{
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    serviceReceived: String,
    startDate: Date,
  }],
  requests: [{
    type: { type: String },
    description: String,
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: Date,
  }],
  notes: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
