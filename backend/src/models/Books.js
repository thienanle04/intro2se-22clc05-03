const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  image: {
    type: String,
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  stock: {
    type: Number,
    default: 1
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: [true, 'Genre is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  SBN: {
    type: String,
    required: [true, 'SBN is required']
  },
  rating: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;