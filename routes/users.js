const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  createUser,
  updateUser,
  login,
  getMeInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/me', auth, getMeInfo);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
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
