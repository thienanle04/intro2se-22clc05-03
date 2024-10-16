const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const userSchemal = new Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
  },
  position: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  }
});

const User = mongoose.model("User", userSchemal);

module.exports = User;