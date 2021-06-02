/* eslint-disable linebreak-style */
const router = require('express').Router();
const { idValidation, movieValidation } = require('../middlewares/requestValidation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', movieValidation, createMovie);
router.delete('/:movieId', idValidation, deleteMovie);

module.exports = router;
