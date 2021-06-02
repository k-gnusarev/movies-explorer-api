/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // запретить выдачу хеша пароля при регистрации
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
});

module.exports = mongoose.model('user', userSchema);
