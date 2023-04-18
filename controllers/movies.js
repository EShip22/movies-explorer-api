const movies = require('../models/movie');

//  ошибки
const DelNotMyMovieError = require('../errors/del-not-my-movie-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  console.log(owner);
  movies.find({ owner })
    .then((resMovies) => {
      if (!resMovies) {
        throw new NotFoundError('Фильмы не найдены');
      }
      res.status(200).send(resMovies);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: _id,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка валидации'));
        return;
      }
      next(err);
    });
};

module.exports.delMovie = (req, res, next) => {
  const movieId = req.params._id;
  const { _id } = req.user;
  movies.findById(movieId)
    .then((movie) => {
      // если не найдена, то ошибка
      if (!movie) {
        throw new NotFoundError('Фильм не найдена');
      } else if (movie) {
        // проверяем, что фильм создана мной
        if (movie.owner.toString() === _id) {
          movies.findByIdAndDelete(movieId)
            .then((movieRes) => {
              res.status(200).send(movieRes);
            })
            .catch((err) => next(err));
        } else {
          // ошибка, что не мой фильм
          next(new DelNotMyMovieError('Разрешается удалять только свои фильмы'));
        }
      }
    })
    .catch(next);
};
