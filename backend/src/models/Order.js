const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem'
      }
    }
  ],
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'pending'
  },
  details: {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required']
    },
    number: {
      type: String,
      required: [true, 'Number is required']
    },
    street: {
      type: String,
      required: [true, 'Street is required']
    },
    district: {
      type: String,
      required: [true, 'Province is required']
    },
    ward: {
      type: String,
      required: [true, 'Province is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    }
  }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;