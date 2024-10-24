const User = require('../models/User');
const generateToken = require('../middleware/generateToken');

class AuthController {
  // [POST] /api/auth/login
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(400).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      } else {
        if (user.password === password) {
          const token = generateToken({
            id: user._id,
            username: user.username,
          });

          return res.status(200).json({
            data: token,
            message: 'Login success',
            code: 1
          });
        } else {
          return res.status(400).json({
            data: null,
            message: 'Password is incorrect in file authController.js',
            code: 0
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        data: null,
        message: error.message,
        code: 0
      });
    }
  }

  // [POST] /api/auth/signup
  async signup(req, res) {
    const { username, password, name, email } = req.body;

    try {
      const user = await User.findOne({ username: username });
      if (user) {
        return res.status(400).json({
          data: null,
          message: 'Username is already taken',
          code: 0
        });
      }

      const newUser = new User({
        username: username,
        password: password,
        name: name,
        email: email
      });

      await newUser.save();

      const token = generateToken({
        id: newUser._id,
        username: newUser.username,
      });

      return res.status(200).json({
        data: {
          token: token,
          user: newUser
        },
        message: 'Signup success',
        code: 1
      });
    } catch (error) {

    }
  }

  // [GET] /api/auth/logout
  async logout(req, res) {

    return res.status(200).json({
      data: null,
      message: 'Logout success',
      code: 1
    });
  }

}

module.exports = new AuthController();