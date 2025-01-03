const express = require('express');
const Authentication = require('../middleware/verifyToken.js');
const router = express.Router();
const bookController = require('../controller/bookController.js');
const upload = require('../config/cloudinary.config.js');

router
  .route('')
  .get(bookController.getAllBooks);

router
  .route('/:bookId')
  .get(bookController.getBookById);

router
  .route('')
  .post( upload.single('image'), bookController.createNewBook);
  //Authentication.authenticateToken, Authentication.isAdmin ,

router
  .route('/addListBooks')
  .post(Authentication.authenticateToken, Authentication.isAdmin, upload.single('image'), bookController.addListBooks)

router
  .route('/:bookId/update')
  .patch(Authentication.authenticateToken, Authentication.isAdmin, upload.single('image'), bookController.updateBookById);

router
  .route('/:bookId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, bookController.deleteBookById);

router
  .route('/search/:genre')  // Đặt genre là tham số động trong URL
  .get(bookController.getBookByGenre);

router
  .route('/:bookId/review')
  .post(Authentication.authenticateToken ,bookController.reviewBook);

module.exports = router;
