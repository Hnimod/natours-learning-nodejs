const AppError = require('../utilities/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field ${Object.keys(err.keyPattern)[0]}: ${
    err.keyValue.name
  }`;
  return new AppError(message, 400);
};

const handleValidationErrordDB = (err) => {
  let message = 'Invalid input';
  Object.keys(err.errors).forEach((key) => {
    message += ` ${key}: ${err.errors[key].value}(${err.errors[key].message});`;
  });
  return new AppError(message, 400);
};

const handleInvalidToken = () =>
  new AppError('Invalid Token! Please login again', 401);

const handleExpiredToken = () =>
  new AppError('Expired Token! Please login again', 401);

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.constructor.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    }
    if (error.constructor.name === 'ValidationError') {
      error = handleValidationErrordDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleInvalidToken();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleExpiredToken();
    }

    sendErrorProd(error, res);
  }
};
