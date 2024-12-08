const Genre = require('../models/Genre');

class genreController {
  // [GET] /api/genres: get all genres
  async getAllGenres(req, res) {
    try {
      const genres = await Genre.find();
      res.status(200).json({
        data: {
          genres: genres,
        },
        message: 'Get all genres successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Get all genres failed',
        code: 0
      });
    }
  }

  // [POST] /api/genres: create a new genre
  async createNewGenre(req, res) {
    try {
      const { name } = req.body;

      const genreFound = await Genre.findOne({ name });
      if (genreFound) {
        res.status(500).json({
          data: null,
          message: 'Genre already exists',
          code: 0
        });
      }

      const genre = new Genre({
        name,
        isHidden: false,
      });

      await genre.save();

      res.status(200).json({
        data: {
          genre: genre,
        },
        message: 'Create new genre successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Create new genre failed',
        code: 0
      });
    }
  }

  // [PUT] /api/genres/:id: update a genre
  async updateGenre(req, res) {
    try {
      const { id } = req.params;
      console.log('id', id);
      const { name, isHidden } = req.body;

      console.log(id, name, isHidden);

      const genre = await Genre.findById(id);
      if (!genre) {
        res.status(500).json({
          data: null,
          message: 'Genre not found',
          code: 0
        });
      }

      if (name) genre.name = name;
      if (isHidden) genre.isHidden = isHidden;

      await genre.save();

      res.status(200).json({
        data: {
          genre: genre,
        },
        message: 'Update genre successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Update genre failed',
        code: 0
      });
    }
  }

  // [DELETE] /api/genres/:id: delete a genre
  async deleteGenre(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      const listGenre = await Genre.find();
      console.log(listGenre)

      const genre = await Genre.findById(id);
      if (!genre) {
        res.status(500).json({
          data: null,
          message: 'Genre not found',
          code: 0
        });
      }

      await Genre.findByIdAndDelete(id);

      res.status(200).json({
        data: null,
        message: 'Delete genre successfully',
        code: 1
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Delete genre failed: ' + error.message,
        code: 0
      });
    }
  }

  // [GET] /api/genres/:id: get genre by id
  async getGenreById(req, res) {
    try {
      const { id } = req.params;

      const genre = await Genre.findById(id);
      if (!genre) {
        res.status(500).json({
          data: null,
          message: 'Genre not found',
          code: 0
        });
      }

      res.status(200).json({
        data: {
          genre: genre,
        },
        message: 'Get genre by id successfully',
        code: 1
      });

    } catch (error) {
      res.status(500).json({
        data: null,
        message: 'Get genre by id failed',
        code: 0
      });
    }
  }
}

module.exports = new genreController();