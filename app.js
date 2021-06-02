require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { userInfoValidation, loginValidation } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { PORT = 3000 } = process.env;
const app = express();

// // МИДЛВЕРЫ
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// роуты, не требующие авторизации
app.post('/signin', loginValidation, login);
app.post('/signup', userInfoValidation, createUser);

// роуты, защищённые авторизацией
app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

// security stuff
app.use(helmet());
app.disable('x-powered-by');

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors());

// запрос несуществующего ресурса
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({ message: statusCode === 500 ? 'Что-то пошло не так' : message });

  next();
});

// ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
