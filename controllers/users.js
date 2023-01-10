// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/userScheme');
const {
  NOT_FOUND,
  JWT_SECRET,
  ERR_EMAILPASSWORD,
  ERR_VALIDATION,
  CAST_ERROR,
} = require('../constants/constant');
const DublicateKeyError = require('../errors/DublicateKeyError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadReqError = require('../errors/BadReqError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .status(200)
        .send({ message: 'Пользователь успешно авторизирован' });
    })
    .catch((err) => {
      if (err.message === ERR_EMAILPASSWORD) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.status(200).send(user))
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
    .then(() => res.send({
      name,
      about,
      avatar,
      email,
    }))
    .then((user) => res.status(200).send(user))
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
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
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
    .orFail(new Error(NOT_FOUND))
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при обновлении аватара пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId || req.user._id)
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadReqError('Переданы некорректный _id для поиска пользователя.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден.'));
      }
      return next(err);
    });
};
