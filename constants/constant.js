const NOT_FOUND = 'NotFound';
const CAST_ERROR = 'CastError';
const ERR_EMAILPASSWORD = 'Неправильные почта или пароль';
const ERR_VALIDATION = 'Validation failed';
const allowedCors = [
  'https://domainname.studentegor.nomoredomains.icu',
  'http://domainname.studentegor.nomoredomains.icu',
  'http://localhost:3000',
];

const JWT_SECRET = '659aaa7beae66b90614d6be1739494c7334b10ee8e0155da0b674da72fa3394e';

const REGEX_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;

module.exports = {
  NOT_FOUND,
  CAST_ERROR,
  JWT_SECRET,
  REGEX_URL,
  ERR_EMAILPASSWORD,
  ERR_VALIDATION,
  allowedCors,
};
