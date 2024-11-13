const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  quantity: {
    type: Number,
    default: 1
  }
}, { timestamps: true })

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;