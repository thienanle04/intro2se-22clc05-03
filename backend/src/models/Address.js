const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
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
}, { timestamps: true })

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;