const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const addressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
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
    required: [true, 'District is required']
  },
  ward: {
    type: String,
    required: [true, 'Ward is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  }
}, { timestamps: true });