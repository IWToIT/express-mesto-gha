// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/userScheme');
const {
  NOT_FOUND,
  notFound,
  dataErr,
  JWT_SECRET,
  ERR_EMAILPASSWORD,
  repeatErr,
} = require('../constants/constant');

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
      if (err.message === NOT_FOUND) {
        return res.status(dataErr).send({ message: 'Пользователя с таким email не существует' });
      }
      if (err.message === ERR_EMAILPASSWORD) {
        return res.status(dataErr).send({ message: 'Неправильные почта или пароль' });
      }
      return next();
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
    .then((user) => Users.findById(user._id))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(repeatErr).send({ message: 'Пользователь с таким email уже существует' });
      }
      return next();
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
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return next();
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
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return next();
    });
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId || req.user._id)
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return next();
    });
};
