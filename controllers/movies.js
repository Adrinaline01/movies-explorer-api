const Movie = require('../models/movie');

const ErrorBadReq = require('../errors/error-bad-req');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorForbidden = require('../errors/error-forbidden');

const {
  ERROR_INCORRECT_MOVIE_DATA,
  ERROR_MOVIE_NOT_FOUND,
  ERROR_NO_RIGHTS_TO_DELETE_MOVIE,
} = require('../utils/constants');

const CREATED = 201;

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadReq(ERROR_INCORRECT_MOVIE_DATA));
      } else {
        next(error);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound(ERROR_MOVIE_NOT_FOUND);
      } if (movie.owner.toString() !== req.user._id) {
        throw new ErrorForbidden(ERROR_NO_RIGHTS_TO_DELETE_MOVIE);
      }
      Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Фильм удалён' }))
        .catch(next);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadReq(ERROR_INCORRECT_MOVIE_DATA));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
