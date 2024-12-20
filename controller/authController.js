const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const AppError = require('../utils/appError');

const allowedFor = function (user, roles) {
  return roles.includes(user.role);
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.singup = catchAsync(async (req, res, next) => {
  const { email, password, phone } = req.body;
  if (!email || !password)
    return next(
      new AppError('User password and Email are require'),
    );
  const user = await User.create({
    email,
    password,
    phone,
  });
  createSendToken(user, 201, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  console.log(req.cookies.jwt);

  if (token === 'null' || !token)
    return next(
      new AppError(
        'You are not logged in please log in',
        401,
      ),
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  const currentUser = await User.findById(
    decoded.id,
  ).select('+passwordChangedAt');
  if (!currentUser)
    return next(
      new AppError(
        'The user blongs to this token does not exist anymore',
        401,
      ),
    );

  if (currentUser.passwordChangedAfter(decoded.iat))
    return next(
      new AppError(
        'Password has been changed. Please login again!',
        401,
      ),
    );

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    console.log(roles);
    if (!allowedFor(req.user, roles))
      return next(
        new AppError(
          'You are not authorized to performe this action!',
          403,
        ),
      );
    next();
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password)
    return next(
      new AppError(
        'Please provide Email and password to login!',
        400,
      ),
    );
  const user = await User.findOne({ email }).select(
    '+password',
  );
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  )
    return next(
      new AppError('Incorrect Email or Password!', 401),
    );
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  res.status(200).json({
    status: 'success',
  });
};
