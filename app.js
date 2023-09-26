const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
// const cors = require('cors');
const auth = require('./middlewares/auth');

const app = express();

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login, logout } = require('./controllers/users');
const ErrorNotFound = require('./errors/error-not-found');
const errorCentral = require('./middlewares/error-central');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ERROR_PAGE_NOT_FOUND } = require('./utils/constants');

mongoose.connect('mongodb://0.0.0.0:27017/bitfilmsdb');

app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signout', logout);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('*', (req, res, next) => {
  next(new ErrorNotFound(ERROR_PAGE_NOT_FOUND));
});

app.use(errorLogger);
app.use(errors());

app.use(errorCentral);

app.listen(3000, () => {

});
