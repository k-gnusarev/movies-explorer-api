require('dotenv').config();

const {
  JWT_SECRET = 'some-secret-key',
  PORT = 3000,
  DB_ADRESS = 'mongodb://localhost:27017/movies-explorer',
} = process.env;

module.exports = {
  JWT_SECRET,
  PORT,
  DB_ADRESS,
};
