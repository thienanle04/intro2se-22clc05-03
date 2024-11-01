const express = require('express');
const Authentication = require('../middleware/verifyToken');
const router = express.Router();
const bookController = require('../controller/bookController.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         genre:
 *           type: string
 *           description: The genre of the book
 *         SBN:
 *           type: string
 *           description: The ISBN of the book
 *         description:
 *           type: string
 *           description: A brief description of the book
 *         price:
 *           type: number
 *           description: The price of the book
 *         stock:
 *           type: integer
 *           description: The stock quantity
 *         image:
 *           type: string
 *           description: URL for the book's image
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router
  .route('')
  .get(bookController.getAllBooks);

/**
 * @swagger
 * /api/v1/books/{bookId}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router
  .route('/:bookId')
  .get(bookController.getBookById);

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       500:
 *         description: Book already exists or other error
 */
router
  .route('')
  .post(Authentication.authenticateToken, Authentication.isAdmin, bookController.createNewBook);

/**
 * @swagger
 * /api/v1/books/{bookId}/update:
 *   patch:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
router
  .route('/:bookId/update')
  .patch(Authentication.authenticateToken, Authentication.isAdmin, bookController.updateBookById);

/**
 * @swagger
 * /api/v1/books/{bookId}/delete:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router
  .route('/:bookId/delete')
  .delete(Authentication.authenticateToken, Authentication.isAdmin, bookController.deleteBookById);

module.exports = router;
