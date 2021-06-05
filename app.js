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
const errorHandler = require('./middlewares/errorHandler');
const rateLimiter = require('./middlewares/rateLimiter');

const { PORT, DB_ADRESS } = require('./config');

const app = express();

// // МИДЛВЕРЫ
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

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
app.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// централизованная обработка ошибок
app.use(errorHandler);

// ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ
mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
