require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Cấu hình MulterStorage với Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookStore',  // Thư mục trên Cloudinary để lưu trữ ảnh
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  // Các định dạng file cho phép
  },
});

// Khởi tạo Multer với CloudinaryStorage
const upload = multer({ storage: storage });

module.exports = upload;
