const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const userSchemal = new Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
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