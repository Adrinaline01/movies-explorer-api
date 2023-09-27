const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorAuth = require('../errors/error-auth');
const ErrorBadReq = require('../errors/error-bad-req');
const ErrorConflict = require('../errors/error-conflict');
const ErrorNotFound = require('../errors/error-not-found');

const {
  ERROR_INCORRECT_USER_DATA_REGISTRATION,
  ERROR_USER_EMAIL_EXIST,
  ERROR_INCORRECT_USER_DATA_LOGIN,
  ERROR_USER_NOT_FOUND,
  ERROR_USER_UPDATE,
  ERROR_USER_DATA,
} = require('../utils/constants');

const CREATED = 201;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name, email, password: hashedPassword,
      })
        .then((user) => {
          res.status(CREATED).send({
            name: user.name,
            email: user.email,
          });
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new ErrorBadReq(ERROR_INCORRECT_USER_DATA_REGISTRATION));
          } else if (error.code === 11000) {
            next(new ErrorConflict(ERROR_USER_EMAIL_EXIST));
          } else {
            next(error);
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorAuth(ERROR_INCORRECT_USER_DATA_LOGIN);
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => next(new ErrorAuth(ERROR_INCORRECT_USER_DATA_LOGIN)))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const token = jwt.sign({
              _id: user._id,
              expiresIn: '5d',
            }, 'super-strong-secret');
            res.cookie('token', token, {
              maxAge: 36000 * 24 * 5,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            next(new ErrorAuth(ERROR_INCORRECT_USER_DATA_LOGIN));
          }
        });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли из аккаунта' });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(ERROR_USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadReq(ERROR_USER_UPDATE));
      } else {
        next(error);
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(ERROR_USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadReq(ERROR_USER_DATA));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  updateUser,
  getUserById,
};
