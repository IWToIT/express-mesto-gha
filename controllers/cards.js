const { default: mongoose } = require('mongoose');
const Cards = require('../models/cardScheme');
const {
  NOT_FOUND,
  CAST_ERROR,
  ERR500,
  ERR400,
  ERR404,
} = require('../constants/constant');

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => {
      res.status(500).send({ message: ERR500 });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: ERR400 });
      }
      return res.status(500).send({ message: ERR500 });
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send({ data: card });
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

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
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

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
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
