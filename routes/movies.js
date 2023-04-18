const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getMovies,
  createMovie,
  delMovie,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');

const httpRegexG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)/;

router.get('/', auth, getMovies);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(httpRegexG),
    trailerLink: Joi.string().required().pattern(httpRegexG),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
    thumbnail: Joi.string().required().pattern(httpRegexG),
  }),
}), createMovie);
router.delete('/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), delMovie);

module.exports = router;
