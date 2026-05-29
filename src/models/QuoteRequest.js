const mongoose = require('mongoose');

const QuoteRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    enum: {
      values: ['events', 'corporate', 'broadcast', 'arena', 'retail', 'outdoor-advertising', 'other'],
      message: '{VALUE} is not a valid project type'
    }
  },
  screenAreaSqFt: {
    type: Number,
    min: [0, 'Screen area must be positive']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  pixelPitchPreference: {
    type: String,
    trim: true
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'closed-won', 'closed-lost'],
    default: 'new'
  },
  assignedTo: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuoteRequest', QuoteRequestSchema);
