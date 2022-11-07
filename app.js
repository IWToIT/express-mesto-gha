const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { notFound } = require('./constants/constant');
const { validAuthName } = require('./middlewares/validateForJoi');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.use(auth);
app.post('/signin', validAuthName, login);
app.post('/signup', validAuthName, createUser);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(notFound).send({ message: 'Некорректный путь запроса' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
