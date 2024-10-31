const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
    required: [true, 'Genre is required']
  },
  SBN: {
    type: String,
    required: [true, 'SBN is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  }
}, {timestamps: true})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;