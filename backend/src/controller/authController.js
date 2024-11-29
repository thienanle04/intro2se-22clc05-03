const User = require('../models/Users');
const generateToken = require('../middleware/generateToken.js');
const bcrypt = require('bcryptjs');


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
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
          console.log("Authcontroller user Role: ", user.role);
          const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.role
          });

          return res.status(200).json({
            data: token,
            message: 'Login success',
            code: 1,
            role: user.role
          });
        } else {
          return res.status(401).json({
            data: null,
            message: 'Password is incorrect',
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
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        password: hashedPassword,
        name: name,
        email: email
      });

      await newUser.save();

      const token = generateToken({
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
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