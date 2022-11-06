const mongoose = require('mongoose');
const Users = require('../models/userScheme');
const {
  NOT_FOUND,
  CAST_ERROR,
  defaultErr,
  badRequest,
  notFound,
} = require('../constants/constant');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => {
      res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
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
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
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
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};
