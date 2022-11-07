const router = require('express').Router();
const { validDataCard, validId } = require('../middlewares/validateForJoi');

const {
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.post('/', validDataCard, createCard);
router.delete('/:cardId', validId('cardId'), deleteCard);
router.put('/:cardId/likes', validId('cardId'), likeCard);
router.delete('/:cardId/likes', validId('cardId'), dislikeCard);

module.exports = router;
