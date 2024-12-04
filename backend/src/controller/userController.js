const User = require("../models/Users");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Book = require("../models/Books");
const Order = require("../models/Order");
const Genre = require('../models/Genre');

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
      const image = req.image;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }

      // Cập nhật các trường thông tin nếu có
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (phone) user.phone = phone;
      if (role) user.role = role;
      if (image)  {
        const public_id = user.image.split('/').pop().split('.')[0]; // Lấy public_id từ URL cũ
        await cloudinary.uploader.destroy(public_id); // Xóa ảnh cũ khỏi Cloudinary
        user.image = image.path;
      }


      // Xử lý địa chỉ nếu có
      if (address) user.address.push(address);

      // Lưu lại thay đổi
      await user.save();

      res.status(200).json({
        data: user,
        message: 'User updated successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error updating user: ${error.message}`,
        code: 0
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
        cartItem.quantity = quantity;
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

  // [DELETE] /api/cart/item/remove/:bookId
  async removeCartItem(req, res) {
    try {
      const bookId = req.params.bookId; // Get the bookId from the URL
      const userId = req.user.userId; // Get the userId from the authenticated user (req.user)

      // Find the cart for the user
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          data: null,
          message: 'Cart not found',
          code: 0
        });
      }

      for (let item of cart.items) {
        const cartItem = await CartItem.findById(item._id);
        if (cartItem.book.toString() === bookId) {
          // Remove the item from the cart
          cart.items.pull(item);
          await cart.save();
          await CartItem.findByIdAndDelete(item._id);
          return res.status(200).json({
            data: null,
            message: 'Cart item removed successfully',
            code: 1
          });
        }
      }

    }
    catch (error) {
      res.status(500).json({
        data: null,
        message: `Error removing cart item: ${error.message}`,
        code: 0
      });
    }
  }

  // [GET] /api/user/:userId/getCart
  async getCart(req, res) {
    const userId = req.user.id;  // Assuming `req.user.id` holds the authenticated user's ID
    try {
      res.setHeader('Cache-Control', 'no-store'); // Prevent caching

      // Find user and populate their cart
      let user = await User.findById(userId).populate('cart');  // Ensure the cart is populated
      if (!user) {
        return res.status(404).json({
          data: null,
          message: 'User not found',
          code: 0
        });
      }

      // Check if the user has a cart
      if (!user.cart) {
        const newCart = new Cart({
          user: userId,
          items: []
        });
        await newCart.save();
        user.cart = newCart;
        await user.save();
      }
      // Fetch books and their quantities from the cart
      const cartItemsWithDetails = [];

      for (let item of user.cart.items) {
        const cartItem = await CartItem.findById(item._id);
        const book = await Book.findById(cartItem.book); // Assuming each cart item has a `bookId` reference

        if (book) {
          const genreId = book.genre;
          const genre = await Genre.findById(genreId);

          // Modify the genre in the response object, but not in the database
          const bookWithGenreName = {
            ...book.toObject(),
            genre: genre.name  // Add the genre name in place of the genre ObjectId
          };

          cartItemsWithDetails.push({
            ...bookWithGenreName,
            quantity: cartItem.quantity // Add the quantity of that book in the cart
          });
        } else {
          console.log('Book not found for cart item:', item.bookId);
        }
      }

      // Return the entire cart, including items
      res.status(200).json({
        data: cartItemsWithDetails,
        message: 'Cart fetched successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: `Error fetching cart: ${error.message}`,
        code: 0
      });
    }
  }

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

}

module.exports = new UserController();