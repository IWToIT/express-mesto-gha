const mongoose = require('mongoose');
const Users = require('../models/userScheme');
const {
  NOT_FOUND,
  CAST_ERROR,
  ERR500,
  ERR400,
  ERR404,
} = require('../constants/constant');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => {
      res.status(500).send({ message: ERR500 });
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
        return res.status(400).send({ message: ERR400 });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: ERR404 });
      }
      return res.status(500).send({ message: ERR500 });
    });
};

module.exports.createUser = (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: ERR400 });
      }
      return res.status(500).send({ message: ERR500 });
    });
};

module.exports.updateUser = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: ERR400 });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: ERR404 });
      }
      return res.status(500).send({ message: ERR500 });
    });
};

module.exports.updateAvatar = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: ERR400 });
      }
      if (err.message === NOT_FOUND) {
        return res.status(404).send({ message: ERR404 });
      }
      return res.status(500).send({ message: ERR500 });
    });
};
