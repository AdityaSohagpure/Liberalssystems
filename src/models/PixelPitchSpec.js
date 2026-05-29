const mongoose = require('mongoose');

const PixelPitchSpecSchema = new mongoose.Schema({
  pitch: {
    type: String,
    required: [true, 'Pixel pitch is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Pitch type is required'],
    enum: {
      values: ['indoor', 'outdoor'],
      message: '{VALUE} is not a valid pitch type'
    }
  },
  label: {
    type: String,
    required: [true, 'Spec label is required'],
    trim: true
  },
  optimalViewingDistanceMin: {
    type: Number,
    required: [true, 'Minimum viewing distance is required'],
    min: 0
  },
  optimalViewingDistanceMax: {
    type: Number,
    required: [true, 'Maximum viewing distance is required'],
    min: 0
  },
  refreshRate: {
    type: String,
    trim: true
  },
  maxPowerPerSqm: {
    type: Number,
    min: 0
  },
  avgPowerPerSqm: {
    type: Number,
    min: 0
  },
  cabinetDimensions: {
    type: String,
    trim: true
  },
  pixelDensityPerSqm: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('PixelPitchSpec', PixelPitchSpecSchema);
