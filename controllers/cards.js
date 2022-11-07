const { default: mongoose } = require('mongoose');
const Cards = require('../models/cardScheme');
const {
  NOT_FOUND,
  CAST_ERROR,
  defaultErr,
  badRequest,
  notFound,
  admitErr,
} = require('../constants/constant');

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then((card) => res.status(200).send(card))
    .catch(() => {
      res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(admitErr).send({ message: 'У вас отсутствуют права для удаления карточки' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные карточки' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }
      if (err.message === NOT_FOUND) {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(defaultErr).send({ message: 'На сервере произошла ошибка' });
    });
};
