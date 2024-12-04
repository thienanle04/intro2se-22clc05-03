const User = require("../models/Users");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Book = require("../models/Books");
const Order = require("../models/Order");
const cloudinary = require('cloudinary').v2; // Đảm bảo import Cloudinary
const upload = require('../config/cloudinary.config'); // Đảm bảo import cấu hình Cloudinary (nếu bạn sử dụng multer-storage-cloudinary)

// req.user = { userId, username, role }
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

  // [GET] /api/user/:userId
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      let user = await User.findById(userId); // Tìm user theo ID

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
        code: 1
      }); // Trả về thông tin user nếu tìm thấy
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Error retrieving user',
        code: 0,
        error: error.message
      }); // Xử lý lỗi
    }
  }

  // [PATCH] /api/user/update
  async updateMyProfile(req, res) {
    try {
      const userId = req.user.id; // Lấy ID người dùng từ JWT
      const { email, password, name, address, phone, role } = req.body;
      const image = req.file; // Ảnh mới nếu có
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0,
        });
      }
  
      // Cập nhật các trường thông tin nếu có
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (phone) user.phone = phone;
      if (role) user.role = role;
  
      if (image) {
        // Lấy public_id từ URL ảnh cũ
        const public_id = user.image.split('/').pop().split('.')[0]; // Lấy public_id từ URL cũ
        // Xóa ảnh cũ khỏi Cloudinary nếu có
        const result = await cloudinary.uploader.destroy(public_id);
        if (result.result === 'ok') {
          console.log('Delete success');
        } else {
          console.log('Delete failed');
        }
  
        // Cập nhật ảnh mới
        user.image = image.path; // Lưu đường dẫn ảnh mới (hoặc URL nếu bạn muốn lưu URL)
      }
  
      // Xử lý địa chỉ nếu có
      if (address) user.address.push(address);
  
      // Lưu lại thay đổi
      await user.save();
  
      res.status(200).json({
        data: user,
        message: 'User updated successfully',
        code: 1,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        data: null,
        message: `Error updating user: ${error.message}`,
        code: 0,
      });
    }
  }

  // [DELETE] /api/user/delete/:userId
  async deleteUser(req, res) {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          data: null,
          message: `User ${userId} not found`,
          code: 0
        });
      }
  
      // Nếu có ảnh, xóa ảnh khỏi Cloudinary
      if (user.img) {
        const public_id = user.img.split('/').pop().split('.')[0]; // Lấy public_id từ URL ảnh
        await cloudinary.uploader.destroy(public_id); // Xóa ảnh khỏi Cloudinary
      }
  
      // Xóa người dùng khỏi cơ sở dữ liệu
      await User.deleteOne({ _id: userId });
  
      res.status(200).json({
        data: null,
        message: `User ${userId} deleted successfully`,
        code: 1
      });
    } catch (err) {
      res.status(400).json({
        data: null,
        message: `Failed to delete user ${userId}: ${err.message}`,
        code: 0
      });
    }
  }

  // [POST] /api/user/:userId/addCart
  async addCart(req, res) {
    const userId = req.user.id;
    const { bookName, quantity } = req.body;
    try {
      // Tìm sách theo tên
      const book = await Book.findOne({ title: bookName });
      if (!book) {
        return res.status(404).json({
          data: null,
          message: 'Book not found',
          code: 0
        });
      }

      // Kiểm tra số lượng sách còn lại
      if (book.stock < quantity) {
        return res.status(400).json({
          data: null,
          message: 'Not enough stock',
          code: 0
        });
      }

      // Tìm và cập nhật hoặc tạo mới giỏ hàng của người dùng
      let user = await User.findById(userId).populate('cart');
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }

      // Nếu người dùng chưa có giỏ hàng, tạo giỏ hàng mới
      if (!user.cart) {
        const newCart = new Cart({
          user: userId,
          items: []
        });
        await newCart.save();
        user.cart = newCart._id;
        await user.save();
      }

      // Kiểm tra sản phẩm trong giỏ hàng
      let cartItem = await CartItem.findOne({ book: book._id });
      if (cartItem) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới
        const newCartItem = new CartItem({
          book: book._id,
          quantity: quantity
        });
        await newCartItem.save();

        // Thêm mục giỏ hàng vào giỏ hàng của người dùng
        const cart = await Cart.findById(user.cart);
        cart.items.push(newCartItem);
        await cart.save();
      }

      // Trả về kết quả thành công
      res.status(200).json({
        data: user.cart,
        message: 'Added to cart successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error adding to cart: ${error.message}`,
        code: 0
      });
    }
  }

  // [POST] /api/user/:userId/removeCart
  async removeCart(req, res) {
    const userId = req.user.id;
    
    try {
      let user = await User.findById(userId).populate('cart');
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }
      // Kiểm tra giỏ hàng
      if (!user.cart) {
        return res.status(404).json({
          data: null,
          message: 'Cart not found',
          code: 0
        });
      }

      // Xóa giỏ hàng

      await CartItem.deleteMany({ _id: { $in: user.cart.items } });
      await Cart.findByIdAndDelete(user.cart);
      user.cart = null;
      await user.save();
      // Trả về kết quả thành công
      res.status(200).json({
        data: null,
        message: 'Cart removed successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error delete to cart: ${error.message}`,
        code: 0
      });
    }
    
  }

  // [POST] /api/user/:userId/payment
  async payment(req, res) {
    // const userId = req.user.id;
    const userId = req.params.userId;
    const { name, email, phone, number, street, district, ward, city } = req.body;
    try {
      const user = await User.findById(userId).populate('cart');
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }

      if (!user.cart) {
        return res.status(404).json({
          data: null,
          message: 'Cart not found',
          code: 0
        });
      }

      // Tạo đơn hàng mới
      const newOrder = new Order({
        user: userId,
        items: user.cart.items,
        details: {
          name,
          email,
          phone,
          number,
          street,
          district,
          ward,
          city
        }
      });
      await newOrder.save();
      user.order.push(newOrder._id);
      // Xóa giỏ hàng
      await CartItem.deleteMany({ _id: { $in: user.cart.items } });
      await Cart.findByIdAndDelete(user.cart);
      user.cart = null;
      await user.save();

      // Trả về kết quả thành công

      res.status(200).json({
        data: newOrder,
        message: 'Payment successfully',
        code: 1
      });



    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error payment: ${error.message}`,
        code: 0
      });
    }
  
  }

  // [POST] /api/v1/users/create: create user, only admin can access
  async createUser(req, res){
    try {
      const { username, password, email, role } = req.body;

      // check if required fields are missing
      if (!username || !password || !email || !role) {
        return res.status(400).json({
          data: null,
          message: 'Missing required fields',
          code: 0
        });
      }

      // check if role is valid
      if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({
          data: null,
          message: 'Invalid role',
          code: 0
        });
      }

      // check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          data: null,
          message: 'User already exists',
          code: 0
        });
      }

      const newUser = new User({ username, password, email, role });
      await newUser.save();
      res.status(200).json({
        data: newUser,
        message: 'User created successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error creating user: ${error.message}`,
        code: 0
      });
    }
  }

}

module.exports = new UserController();
