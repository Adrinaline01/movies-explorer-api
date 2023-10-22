const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/error-auth');

const auth = (req, res, next) => {
  const jwtToken = req.cookies.token;

  let client;

  try {
    client = jwt.verify(jwtToken, 'super-strong-secret');
  } catch (err) {
    next(new ErrorAuth('Вы не авторизованы'));
  }
  req.user = client;
  next();
};

module.exports = auth;
