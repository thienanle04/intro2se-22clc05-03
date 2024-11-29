const Book = require('../models/Books');
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
    console.log(req.body);
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
        rating,
      } = req.body;

      const bookFound = await Book.findOne({ title, author });
      if (bookFound) {
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
      console.log(image)

      const book = new Book({
        title,
        image,
        author,
        genre: genreFound._id,
        SBN,
        description,
        price,
        stock,
        rating
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

      const genreId = book.genre;
      const genre = await Genre.findById(genreId);

      // Modify the genre in the response object, but not in the database
      const bookWithGenreName = {
        ...book.toObject(),
        genre: genre.name  // Add the genre name in place of the genre ObjectId
      };

      res.status(200).json({
        data: {
          book: bookWithGenreName
        },
        message: 'Get book by bookId successfully',
        code: 1
      });
    } catch (error) {
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
      if (genre) {
        var genreFound = await Genre.findOne({ name: genre });
        if (!genreFound) {
          genreFound = new Genre({
            name: genre,
            isHidden: false,
          });
          await genreFound.save();
          book.genre = genreFound._id;
        }
        if (genreFound._id != book.genre) {
          book.genre = genreFound._id;
        }
      }
      if (title) book.title = title;
      if (author) book.author = author;
      if (SBN) book.SBN = SBN;
      if (description) book.description = description;
      if (price) book.price = price;
      if (stock) book.stock = stock;
      if (image) book.image = image;
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
      // await book.remove();
      await Book.findByIdAndDelete(bookId);

      res.status(200).json({
        data: null,
        message: 'Delete book by bookId successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Delete book by bookId failed with error: ' + error.message,
        code: 0
      });
    }
  }

  async addListBooks(req, res) {
    try {
      const listBooks = req.body;
      listBooks.forEach(async book => {
        const {
          title,
          author,
          genre,
          SBN,
          description,
          price,
          stock,
          image,
          rating,
        } = book;

        const bookFound = await Book.findOne({ title, author });
        if (bookFound) {
          return res.status(500).json({
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

        const newBook = new Book({
          title,
          image,
          author,
          genre: genreFound._id,
          SBN,
          description,
          price,
          stock,
          rating
        });
        await newBook.save();
      });
      res.status(201).json({
        data: null,
        message: 'Create new list books successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Create new list books failed with error: ' + error,
        code: 0
      });
    }
  }
  async getBookByGenre(req, res) {
    try {
      const genre = req.params.genre;
      const genreFound = await Genre.findOne({ name: genre });
      if (!genreFound) {
        return res.status(404).json({
          data: null,
          message: 'Genre not found',
          code: 0
        });
      }
      const books = await Book.find({ genre: genreFound._id });
      res.status(200).json({
        data: {
          books,
        },
        message: 'Get book by genre successfully',
        code: 1
      });
    }
    catch (error) {
      res.status(500).json({
        data: null,
        message: 'Get book by genre failed with error: ' + error,
        code: 0
      });
    }
  }

}

module.exports = new BookController();