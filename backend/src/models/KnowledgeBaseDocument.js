const mongoose = require('mongoose');

const kbSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true, unique: true },
  category: { type: String, default: 'General' },
  state: { type: String, default: 'All' },
  language: { type: String, default: 'en' },
  path: { type: String, required: true },
  size: { type: Number },
  chunkCount: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeBaseDocument', kbSchema);
