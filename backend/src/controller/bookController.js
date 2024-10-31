const Book = require('../models/Book');
const Genre = require('../models/Genre');

class BookController {
  // [GET] /api/books: create a new book
  async getAllBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json({
        data: {
          books,
        },
        message: 'Get all books successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Get all books failed',
        code: 0
      });
    }
  }

  // [POST] /api/books: create a new book
  async createNewBook(req, res) {
    try {
      const {
        title,
        author,
        genre,
        SBN,
        description,
        price,
        stock,
        image,
      } = req.body;

      var genreFound = await Genre.findOne({ name: genre });
      if (!genreFound) {
        genreFound = new Genre({ 
          name: genre,
          isHidden: false,
        });
        await genreFound.save();
      }

      const book = new Book({
        title,
        author,
        genre: genreFound._id,
        SBN,
        description,
        price,
        stock,
        image,
      });
      await book.save();
      res.status(201).json({
        data: {
          book,
        },
        message: 'Create new book successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Create new book failed with error: ' + error,
        code: 0
      });
    }
  }

  // [GET] /api/books/bookId: get book by bookId
  async getBookById(req, res) {
    try {
      const book = await Book.findById(req.params.bookId);
      res.status(200).json({
        data: {
          book,
        },
        message: 'Get book by bookId successfully',
        code: 1
      });
    } catch(error) {
      res.status(500).json({
        data: null,
        message: 'Get book by bookId failed',
        code: 0
      });
    }
  }
}

module.exports = new BookController();