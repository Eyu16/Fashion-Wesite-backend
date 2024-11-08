const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const collectionRouter = require('./routes/collectionRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controller/errorController');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(morgan('dev'));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find this ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);
module.exports = app;
