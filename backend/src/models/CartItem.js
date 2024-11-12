const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const cartItemSchema = new Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  }
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;