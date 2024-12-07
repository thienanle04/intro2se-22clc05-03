const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required']
  }
}, { timestamps: true })


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;