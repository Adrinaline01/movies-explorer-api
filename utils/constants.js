const regexUrl = /^:?https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const ERROR_INCORRECT_MOVIE_DATA = 'Ошибка: неверные данные при создании фильма';
const ERROR_MOVIE_NOT_FOUND = 'Ошибка: фильм не найден на сервере';
const ERROR_NO_RIGHTS_TO_DELETE_MOVIE = 'Ошибка: недостаточно прав для удаления фильма';

const ERROR_INCORRECT_USER_DATA_REGISTRATION = 'Ошибка: неверные данные пользователя при регистрации';
const ERROR_USER_EMAIL_EXIST = 'Ошибка: пользователь с таким email уже существует';
const ERROR_INCORRECT_USER_DATA_LOGIN = 'Ошибка: введены неверные данные для входа';
const ERROR_USER_NOT_FOUND = 'Ошибка: на сервере нет данного пользователя';
const ERROR_USER_UPDATE = 'Ошибка: неверные данные при обновлении информации о пользователе';
const ERROR_USER_DATA = 'Ошибка: неверные данные пользователя';
const ERROR_PAGE_NOT_FOUND = 'Упс! Такой страницы нет :(';

module.exports = {
  regexUrl,
  ERROR_INCORRECT_MOVIE_DATA,
  ERROR_MOVIE_NOT_FOUND,
  ERROR_NO_RIGHTS_TO_DELETE_MOVIE,
  ERROR_INCORRECT_USER_DATA_REGISTRATION,
  ERROR_USER_EMAIL_EXIST,
  ERROR_INCORRECT_USER_DATA_LOGIN,
  ERROR_USER_NOT_FOUND,
  ERROR_USER_UPDATE,
  ERROR_USER_DATA,
  ERROR_PAGE_NOT_FOUND,
};
