// /* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// валидация ID
const idValidation = celebrate({
  params: Joi
    .object()
    .keys({
      movieId: Joi
        .string()
        .hex()
        .length(24),
    }),
});

// валидация инфо о пользователе
const userInfoValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
});

// валидация данных карточки
const movieValidation = celebrate({
  body: Joi
    .object()
    .keys({
      country: Joi
        .string()
        .required(),
      director: Joi
        .string()
        .required(),
      duration: Joi
        .number()
        .required(),
      year: Joi
        .string()
        .required(),
      description: Joi
        .string()
        .required(),
      image: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Неправильный формат ссылки');
        }),
      trailer: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Неправильный формат ссылки');
        }),
      thumbnail: Joi
        .string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Неправильный формат ссылки');
        }),
      movieId: Joi
        .string()
        .required(),
      nameRU: Joi
        .string()
        .required(),
      nameEN: Joi
        .string()
        .required(),
    }),
});

// валидация данных авторизации
const loginValidation = celebrate({
  body: Joi
    .object()
    .keys({
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .required()
        .min(8),
    }),
});

// валидация обновления информации о пользователе
const userInfoUpdateValidation = celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .required()
        .min(2)
        .max(30),
      email: Joi
        .string()
        .required()
        .email(),
    }),
});

module.exports = {
  idValidation,
  userInfoValidation,
  movieValidation,
  loginValidation,
  userInfoUpdateValidation,
};
