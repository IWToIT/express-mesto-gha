const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const { validAuthName } = require('../middlewares/validateForJoi');
const auth = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const allowedCors = require('../middlewares/allowedCors');

router.use(requestLogger);

router.use(allowedCors);
router.post('/signin', validAuthName, login);
router.post('/signup', validAuthName, createUser);
router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use(errorLogger);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден.'));
});

module.exports = router;
