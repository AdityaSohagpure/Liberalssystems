const mongoose = require('mongoose');

const CaseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Case study title is required'],
    trim: true
  },
  clientName: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  productUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  screenArea: {
    type: String,
    trim: true
  },
  challenge: {
    type: String,
    trim: true
  },
  solution: {
    type: String,
    trim: true
  },
  outcome: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);
