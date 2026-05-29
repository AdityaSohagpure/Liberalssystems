const mongoose = require('mongoose');

const RentalInquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  eventType: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date
  },
  venueName: {
    type: String,
    trim: true
  },
  venueCity: {
    type: String,
    trim: true
  },
  screenSizeRequired: {
    type: String,
    trim: true
  },
  durationDays: {
    type: Number,
    min: [1, 'Duration must be at least 1 day']
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'confirmed', 'completed'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RentalInquiry', RentalInquirySchema);
