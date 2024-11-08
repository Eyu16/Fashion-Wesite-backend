const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map(
    (err) => err.message,
  );
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (error) =>
  new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = (error) =>
  new AppError(
    'Token has Expired. Please log in again',
    401,
  );

const sendErrorDev = (error, req, res) => {
  console.log(error);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorPro = (error, req, res) => {
  console.log(error);
  if (error.isOperational)
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  if (process.env.NODE_ENV === 'development')
    sendErrorDev(error, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let err = Object.assign({}, error);
    err.message = error.message;
    if (error.name === 'CastError')
      err = handleCastErrorDB(error);
    if (error.code === 11000)
      err = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      err = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      err = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      err = handleJWTExpiredError(error);

    sendErrorPro(err, req, res);
  }
};
