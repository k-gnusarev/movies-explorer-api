const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { JWT_SECRET } = require('../config');

function handleErrors(err) {
  if (err.name === 'MongoError' || err.code === '11000') {
    throw new ConflictError('Пользователь с таким email уже зарегистрирован');
  }

  if (err.message === 'NullReturned' || err.name === 'CastError') {
    throw new NotFoundError(err.message);
  } else {
    throw new ValidationError(err.message);
  }
}

// PATCH /users/me — обновляет профиль
const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(new Error('NullReturned'))
    .then((user) => res.send(user))
    .catch((err) => handleErrors(err))
    .catch(next);
};

// GET users/me — выдаёт текущего пользователя
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id) // поиск пользователя
    .orFail(new NotFoundError('Пользователя не существует'))
    .then((user) => res.send(user))
    .catch(next);
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password') // вернуть хеш пароля при авторизации
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      // пользователь найден
      return bcrypt.compare(password, user.password).then((matched) => {
        // проверка соответствия хеша пароля с базой
        if (!matched) {
          // хеши не совпали — выкидываем ошибку
          throw new AuthError('Неправильные почта или пароль');
        }

        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      // выдать токен
      res.send({ token });
    })
    .catch(next);
};

// POST /users — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body; // извлекаем данные из тела запроса

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({ // записываем данные пользователя в ответ и отправляем его
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('Пользователь уже зарегистрирован');
      }

      throw new ValidationError(err.message);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUserInfo,
  getCurrentUser,
  login,
};
