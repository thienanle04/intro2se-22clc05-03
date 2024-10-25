// adminConfig.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Dùng để hash mật khẩu
const User = require('../models/User');

async function createAdminAccount() {
  try {
    // Kiểm tra nếu đã có tài khoản admin trong database
    const adminUser = await User.findOne({ username: 'admin123' });
    if (adminUser) {
      console.log('Admin account already exists.');
      return;
    }

    // Nếu chưa có admin, tạo một tài khoản mới
    const hashedPassword = await bcrypt.hash('admin123', 10);  // Hash mật khẩu admin123
    const newAdmin = new User({
      username: 'admin123',
      password: hashedPassword,
      role: 'admin'  // Có thể thêm các trường khác nếu cần
    });

    await newAdmin.save();
    console.log('Admin account created successfully with username: admin123 and password: admin123');
  } catch (error) {
    console.error('Error creating admin account:', error);
  }
}

module.exports = createAdminAccount;
