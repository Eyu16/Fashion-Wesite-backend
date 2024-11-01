const sendErrorDev = (error, req, res, next) => {
  console.log('from global Error handler');
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  sendErrorDev(error, req, res);
};
