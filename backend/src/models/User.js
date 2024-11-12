const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const userSchemal = new Schema({
  image: {
    type: String,
    default: "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png",
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
    default: "customer",
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchemal);

module.exports = User;