const Cards = require('../models/cardScheme');
const {
  NOT_FOUND,
  CAST_ERROR,
  ERR_VALIDATION,
} = require('../constants/constant');
const BadReqError = require('../errors/BadReqError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCard = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === ERR_VALIDATION) {
        return next(new BadReqError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('У вас отсутствуют права для удаления карточки.'));
      }
      res.status(200).send({ data: card });
      return Cards.findByIdAndDelete(card._id.toString());
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные карточки.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadReqError('Переданы некорректные данные для постановки лайка.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error(NOT_FOUND))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные для снятии лайка.'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      return next(err);
    });
};
