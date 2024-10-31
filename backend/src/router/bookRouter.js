const express = require('express');
const Authentication = require('../middleware/verifyToken');

const router = express.Router();
const bookController = require('../controller/bookController.js');

// [GET] /api/books: get all books
router
  .route('')
  .get(bookController.getAllBooks)
// [GET] /api/books/bookId: get book by bookId
router
  .route('/:bookId')
  .get(bookController.getBookById)

// [POST] /api/books: create a new book
router
  .route('')
  .post(Authentication.authenticateToken, Authentication.isAdmin, bookController.createNewBook)
// // [PATCH] /api/books/bookId/update: update book by bookId
// router
//   .route('/:bookId/update')
//   .patch(Authentication.authenticateToken, Authentication.isAdmin, bookController.updateBookById)
// // [DELETE] /api/books/bookId/delete: delete book by bookId
// router
//   .route('/:bookId/delete')
//   .delete(Authentication.authenticateToken, Authentication.isAdmin, bookController.deleteBookById)
module.exports = router;