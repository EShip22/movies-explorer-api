const jwt = require('jsonwebtoken');
const IncorrectEmailPasswordError = require('../errors/incorrect-email-password-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new IncorrectEmailPasswordError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new IncorrectEmailPasswordError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
