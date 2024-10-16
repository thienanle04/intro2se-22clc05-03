const User = require("../models/User");

class UserController {
  // [GET] /api/user
  async getAllUsers(req, res) {
    // [GET] /user
    try {
      const userData = await User.find(); 
      res.status(200).json({ 
        data: userData,
        message: "get-all-data-success",
        code: 1
      });
    } catch (err) {
      res.status(400).json({
        data: null,
        message: err.message,
        code: 0
      });
    }
  }
  // [POST] /api/user
  async createUser(req, res) { 
    try {
      const userData = req.body;
      const newUser = new User(userData);
      await newUser.save();
      res.status(200).json({ 
        data: userData,
        message: "get-all-data-success",
        code: 1
      });
    } catch (err) {
      res.status(400).json({
        data: null,
        message: err.message,
        code: 0
      });
    }
  }
}

// Sử dụng module.exports thay vì exports
module.exports = new UserController();