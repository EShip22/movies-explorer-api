const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  createUser,
  //  getUsers,
  //  getUser,
  updateUser,
  //  updateAvatar,
  login,
  getMeInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

//  const httpRegexG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.
//  [a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)/;

router.get('/me', auth, getMeInfo);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    //  avatar: Joi.string().pattern(httpRegexG),
    name: Joi.string().min(2).max(30),
    //  about: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
