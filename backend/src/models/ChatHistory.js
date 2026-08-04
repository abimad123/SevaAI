const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  title: { type: String, default: 'New Conversation' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sources: [{
      title: String,
      content: String,
      source: String,
      relevanceScore: Number,
    }],
    confidence: { type: Number, min: 0, max: 1 },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    attachments: [{ name: String, url: String, type: String }],
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      helpful: Boolean,
    },
    processingTime: Number,
    isError: { type: Boolean, default: false },
  }],
  context: {
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  isActive: { type: Boolean, default: true },
  totalTokensUsed: { type: Number, default: 0 },
  lastMessageAt: { type: Date },
}, { timestamps: true });

chatHistorySchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
