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

      const bookFound = await Book.findOne({ title, author });
      if(bookFound){
        res.status(500).json({
          data: null,
          message: 'Book already exists',
          code: 0
        });
      }

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

  // [PATCH] /api/books/bookId/update: update book by bookId
  async updateBookById(req, res) {
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
    
    try {
      const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        data: null,
        message: 'Book not found',
        code: 0
      });
    }
    if(genre){
      var genreFound = await Genre.findOne({ name: genre });
      if (!genreFound) {
        genreFound = new Genre({ 
          name: genre,
          isHidden: false,
        });
        await genreFound.save();
        book.genre = genreFound._id;
      }
      if(genreFound._id != book.genre){
        book.genre = genreFound._id;
      }
    }
    if(title) book.title = title;
    if(author) book.author = author;
    if(SBN) book.SBN = SBN;
    if(description) book.description = description;
    if(price) book.price = price;
    if(stock) book.stock = stock;
    if(image) book.image = image;
    await book.save();
    res.status(200).json({
      data: {
        book,
      },
      message: 'Update book by bookId successfully',
      code: 1
    });
    } catch (error) {
      res.status(200).json({
        data: null,  
        message: 'Update book by bookId failed with error: ' + error.message,
        code: 0
      });
    }

  }

  // [DELETE] /api/books/bookId/delete: delete book by bookId
  async deleteBookById(req, res) {
    try {
      const bookId = req.params.bookId;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({
          data: null,
          message: 'Book not found',
          code: 0
        });
      }
      await book.remove();
      res.status(200).json({
        data: null,
        message: 'Delete book by bookId successfully',
        code: 1
      });

    }catch(error){
      res.status(500).json({
        data: null,
        message: 'Delete book by bookId failed with error: ' + error.message,
        code: 0
      });
    }
  }
      
}

module.exports = new BookController();