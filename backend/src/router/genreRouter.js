const express = require('express');
const router = express.Router();

const genreController = require('../controller/genreController.js');

// [GET] /api/genres: get all genres
router
  .route("")
  .get(genreController.getAllGenres);

// [POST] /api/genres: create a new genre
router
  .route("")
  .post(genreController.createNewGenre);

// [PUT] /api/genres/{genreId}: update genre by genreId
router
  .route("/:id")
  .put(genreController.updateGenre);

// [DELETE] /api/genres/{genreId}: delete genre by genreId
router
  .route("/:id")
  .delete(genreController.deleteGenre);

// [GET] /api/genres/{genreId}: get genre by genreId
router
  .route("/:id")
  .get(genreController.getGenreById);

module.exports = router;