const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { regexUrl } = require('../utils/constants');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexUrl),
    trailerLink: Joi.string().required().regex(regexUrl),
    thumbnail: Joi.string().required().regex(regexUrl),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required(),
  }),
}), deleteMovie);

module.exports = router;
