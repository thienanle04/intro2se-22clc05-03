const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phone: {
    type: String,
  },
  address: [
    {
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
      },
    }
  ],
  role: {
    type: String,
    default: 'customer'
  },
  image: {
    type: String,
    default: 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;