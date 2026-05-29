const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['outdoor', 'indoor', 'transparent', 'mobile-advertising'],
      message: '{VALUE} is not a valid category'
    }
  },
  type: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  priceUnit: {
    type: String,
    required: [true, 'Price unit is required'],
    enum: {
      values: ['sq_ft', 'piece'],
      message: '{VALUE} is not a valid price unit'
    }
  },
  description: {
    type: String,
    trim: true
  },
  brightness: {
    type: String,
    trim: true
  },
  cabinetType: {
    type: String,
    trim: true
  },
  pixelPitchOptions: {
    type: [String],
    default: []
  },
  refreshRate: {
    type: String,
    trim: true
  },
  resolution: {
    type: String,
    trim: true
  },
  transparency: {
    type: String,
    trim: true
  },
  hydraulicLift: {
    type: Boolean,
    default: false
  },
  onBoardGenerator: {
    type: Boolean,
    default: false
  },
  cabinetDimensions: {
    type: String,
    trim: true
  },
  powerConsumption: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Exclude soft-deleted products by default from queries
ProductSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
