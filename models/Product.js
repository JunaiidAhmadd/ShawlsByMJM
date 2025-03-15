const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    default: 'Women Winter and Summer Shawls'
  },
  tags: [String],
  colors: [String],
  sizes: [String],
  stockQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  brand: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived'],
    default: 'Active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: '/img/product/no-image.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [reviewSchema],
}, {
  timestamps: true
});

// Create text index for search
productSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text'
});

module.exports = mongoose.model('Product', productSchema); 