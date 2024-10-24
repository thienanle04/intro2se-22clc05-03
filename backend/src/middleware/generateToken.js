const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (payload) => {
  return jwt.sign( payload , process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
}

module.exports = generateToken;