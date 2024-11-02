const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const collectionRouter = require('./routes/collectionRoutes');
const globalErrorHandler = require('./controller/errorController');

const app = express();
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/collections', collectionRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find this ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);
module.exports = app;
