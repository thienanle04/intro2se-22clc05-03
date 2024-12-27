const Book = require('../models/Books');
const Genre = require('../models/Genre');
const Review = require('../models/Review');
const User = require('../models/Users');

class BookController {
  // [GET] /api/v1/books: create a new book
  async getAllBooks(req, res) {
    try {
      const books = await Book.find();

      // For each book, get the genre name by using the genreId
      const booksWithGenreNames = await Promise.all(
        books.map(async (book) => {
          const genre = await Genre.findById(book.genre);
          return {
            ...book.toObject(),
            genre: genre ? genre.name : null  // Add genre name instead of genre ID
          };
        })
      );

      res.status(200).json({
        data: {
          books: booksWithGenreNames,
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

  // [POST] /api/v1/books: create a new book
  async createNewBook(req, res) {
    console.log(req.body);
    try {
      const book = req.body;
      const {
        title,
        author,
        genre,
        SBN,
        description,
        price,
        stock,
        rating,
      } = book;

      if (req.file) {
        book.image = req.file.path;
      }

      const bookFound = await Book.findOne({
        $or: [{ title, author }, { SBN }]
      });

      if (bookFound) {
        return res.status(400).json({
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
        image: book.image,
        author,
        genre: genreFound._id,
        SBN,
        description,
        price,
        stock,
        rating
      });
      await newBook.save();

      res.status(201).json({
        data: {
          book: newBook,
        },
        message: "Create new book successfully",
        code: 1
      })
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Create new book failed with error: ' + error,
        code: 0
      });
    }
  }

  // [GET] /api/v1/books/bookId: get book by bookId
  async getBookById(req, res) {
    try {
      console.log(req.params.bookId)
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({
          data: null,
          message: 'Book not found',
          code: 0
        });
      }

      const genreId = book.genre;
      const genre = await Genre.findById(genreId);

      const listComment = await Promise.all(book.reviews.map(async (reviewId) => {
        const review = await Review.findById(reviewId);
        const user = await User.findById(review.user);
        return {
          user: user.name,
          avatar: user.image,
          content: review.content,
          rating: review.rating
        };
      }));

      // Modify the genre in the response object, but not in the database
      const bookWithGenreName = {
        ...book.toObject(),
        genre: genre.name,  // Add the genre name in place of the genre ObjectId
        reviews: listComment
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

  // [PATCH] /api/v1/books/bookId/update: update book by bookId
  async updateBookById(req, res) {
    const {
      title,
      author,
      genre,
      SBN,
      description,
      price,
      rating,
      stock,
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
      if (rating) book.rating = rating;
      if (stock) book.stock = stock;

      // Check if book already exists
      const bookFound = await Book.findOne({
        $or: [{ title, author }, { SBN }],
        _id: { $ne: bookId }
      });

      if (bookFound) {
        return res.status(400).json({
          data: null,
          message: 'Duplicate SBN or title along with author',
          code: 0
        });
      }

      if (req.file) {
        book.image = req.file.path
      }
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

  // [DELETE] /api/v1/books/bookId/delete: delete book by bookId
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

  // [POST] /api/v1/books/addListBooks: add list books
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
          rating,
        } = book;

        if (req.file) {
          book.image = req.file.path;
        }


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
          image: book.image,
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

  // [GET] /api/v1/books/genre/:genre: get book by genre
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
      const booksWithGenreNames = books.map((book) => ({
        ...book.toObject(),
        genre: genreFound.name
      }));

      res.status(200).json({
        data: {
          books: booksWithGenreNames,
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

  // [POST] /api/v1/books/:bookId/ : review book
  async reviewBook(req, res) {
    try {
      const bookId = req.params.bookId;
      const { rating, comment } = req.body;
      const userId = req.user.id;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({
          data: null,
          message: 'Book not found',
          code: 0
        });
      }

      const review = new Review({
        user: userId,
        book: bookId,
        content: comment,
        rating: rating
      });
      book.reviews.push(review);
      await review.save();
      await book.save();
      res.status(200).json({
        data: {
          book,
        },
        message: 'Review book successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Review book failed with error: ' + error,
        code: 0
      });
    }
  }

}

module.exports = new BookController();