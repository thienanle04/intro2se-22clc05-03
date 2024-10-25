const User = require("../models/User");

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
  async getUserById(req, res){
    try {
      const userIdFromToken = req.user.id;
      const userId = req.params.userId; // Lấy userId từ URL
      if(userId != userIdFromToken && req.user.role !== 'admin'){
        return res.status(403).json({
          data: null,
          message: 'You cant access otherUser',
          code: 0
        });
      }
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
}

// Sử dụng module.exports thay vì exports
module.exports = new UserController();