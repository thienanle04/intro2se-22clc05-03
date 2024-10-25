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
  },
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

const User = mongoose.model("User", userSchemal);

module.exports = User;