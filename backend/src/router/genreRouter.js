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