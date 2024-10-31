const User = require("../models/User");

// req.user = {userId, username, role}
class UserController {
  // [GET] /api/user
  async getAllUsers(req, res) {
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
  // [GET] /api/user/userId
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId); // Tìm user theo ID

      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        }); // Trả về lỗi nếu không tìm thấy user
      }

      res.status(200).json({
        data: user,
        message: `User ${userId} found`,
        code: 0

      }); // Trả về thông tin user nếu tìm thấy
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: error.message }); // Xử lý lỗi
    }
  };

  // [PATCH] /api/user/update
  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const { email, password, name, address, phone } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      if (address) {
        user.address = address;
      }
      if (phone) {
        user.phone = phone;
      }
      await user.save();
      res.status(200).json({
        data: user,
        message: 'User updated success',
        code: 1
      });
    }
    catch (error) {
      res.status(500).json({
        data: null,
        message: `Error updating user withc error: ${error.message}`,
        code: 0
      });
    }
  }

  // [DELETE] /api/user/delete
  async deleteUser(req, res) {
    const _id = req.params.userId;
    try {


      // Find the user by ID and delete it
      const deletedUser = await User.deleteOne({ _id });
      if (deletedUser.deletedCount === 0) {
        // If the user with the specified ID is not found, return an error response
        return res.status(404).json({
          data: null,
          message: `delete user ${_id} failed`,
          code: 0
        });
      }
      
      console.log(deletedUser);

      res.status(201).json({
        data: null,
        message: `delete user ${_id} success`,
        code: 1
      })
    } catch (err) {
      res.status(400).json({
        data: null,
        message: `delete user ${_id} failed with error: ${err.message}`,
        code: 0
      })
    }
  }
}

module.exports = new UserController();