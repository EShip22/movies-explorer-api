const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const users = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const IncorrectEmailPasswordError = require('../errors/incorrect-email-password-err');
const AlreadyExistsEmailError = require('../errors/already-exists-email-err');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newuser) => res.status(200).send({
      _id: newuser._id,
      name: newuser.name,
      about: newuser.about,
      avatar: newuser.avatar,
      email: newuser.email,
    }))
    .catch((err) => {
      if (err.toString().indexOf('ValidationError') >= 0) {
        next(new ValidationError('Ошибка валидации'));
        return;
      }
      if (err.code === 11000) {
        next(new AlreadyExistsEmailError('Ошибка валидации'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((finduser) => {
      if (!finduser) {
        throw new IncorrectEmailPasswordError('Пользователь не найден');
      }
      return bcrypt.compare(password, finduser.password)
        .then((matched) => {
          if (!matched) {
            throw new IncorrectEmailPasswordError('Неверные email или пароль');
          } else {
            const { NODE_ENV, JWT_SECRET } = process.env;
            try {
              const _id = jwt.sign({ _id: finduser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
              res.status(200).send({ _id });
            } catch (err) {
              throw new IncorrectEmailPasswordError();
            }
          }
        });
    })
    .catch(next);
};

module.exports.getMeInfo = (req, res, next) => {
  const { _id } = req.user;

  users.findById(_id)
    .then((resUser) => {
      if (!resUser) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send(resUser);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const {
    name, about,
  } = req.body;
  const { _id } = req.user;

  users.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((resUser) => {
      if (!resUser) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send(resUser);
      }
    })
    .catch((err) => {
      if (err.toString().indexOf('ValidationError') >= 0) {
        next(new ValidationError('Ошибка валидации'));
        return;
      }
      next(err);
    });
};
