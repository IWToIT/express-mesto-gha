// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/userScheme');
const {
  ERR_VALIDATION,
  CAST_ERROR,
} = require('../constants/constant');
const DublicateKeyError = require('../errors/DublicateKeyError');
const NotFoundError = require('../errors/NotFoundError');
const BadReqError = require('../errors/BadReqError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ message: 'Пользователь успешно авторизирован' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Пользователь успешно вышел.' });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => Users.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyError('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при обновлении пользователя.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при обновлении аватара пользователя.'));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId || req.user._id)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadReqError('Переданы некорректный _id для поиска пользователя.'));
      }
      return next(err);
    });
};
