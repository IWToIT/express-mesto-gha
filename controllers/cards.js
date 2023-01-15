const Cards = require('../models/cardScheme');
const Users = require('../models/userScheme');
const {
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
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('У вас отсутствуют права для удаления карточки.'));
      }
      return Cards.findByIdAndDelete(card._id.toString()).then(() => {
        res.send(card);
      });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные карточки.'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      const { name, _id } = user;
      Cards.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: { name, _id } } },
        { new: true },
      )
        .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
        .then((card) => {
          res.send(card);
        })
        .catch((err) => {
          if (err.name === CAST_ERROR) {
            return next(new BadReqError('Переданы некорректные данные для постановки лайка.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные для снятии лайка.'));
      }
      return next(err);
    });
};
