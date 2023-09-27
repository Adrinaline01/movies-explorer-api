const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const {
  dataMovies = 'mongodb://0.0.0.0:27017/bitfilmsdb',
  PORT = 3000,
} = process.env;

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorCentral = require('./middlewares/error-central');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://adrinalinediploma.nomoredomainsrocks.ru', 'https://adrinalinediploma.nomoredomainsrocks.ru'],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 30,
}));

app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());

app.use(errorCentral);

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {

});
