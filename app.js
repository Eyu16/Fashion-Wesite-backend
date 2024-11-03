const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const collectionRouter = require('./routes/collectionRoutes');
const productRouter = require('./routes/productRoutes');
const globalErrorHandler = require('./controller/errorController');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/products', productRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find this ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);
module.exports = app;
