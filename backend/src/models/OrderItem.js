const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const orderItemSchema = new Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  }
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;