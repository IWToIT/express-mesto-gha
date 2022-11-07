const NOT_FOUND = 'NotFound';
const CAST_ERROR = 'CastError';
const JWT_SECRET = '659aaa7beae66b90614d6be1739494c7334b10ee8e0155da0b674da72fa3394e';
const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
const ERR_EMAILPASSWORD = 'Неправильные почта или пароль';
const ERR_VALIDATION = 'Validation failed';

const badRequest = 400;
const notFound = 404;
const defaultErr = 500;
const admitErr = 403;
const emailErr = 450;
const dataErr = 401;
const repeatErr = 409;

module.exports = {
  NOT_FOUND,
  CAST_ERROR,
  defaultErr,
  badRequest,
  notFound,
  admitErr,
  emailErr,
  dataErr,
  JWT_SECRET,
  REGEX_URL,
  ERR_EMAILPASSWORD,
  ERR_VALIDATION,
  repeatErr,
};
