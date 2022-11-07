const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET, dataErr } = require('../constants/constant');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(dataErr).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    return res.status(dataErr).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
