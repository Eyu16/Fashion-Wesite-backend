const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const collectionRouter = require('./routes/collectionRoutes');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const emailRouter = require('./routes/emailRoutes');
const globalErrorHandler = require('./controller/errorController');

const orderController = require('./controller/orderController');

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.8.102:5173',
  'https://marakifashion.netlify.app',
];
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes('chapa')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(morgan('dev'));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());
app.get(
  '/verifyPayment/:txRef',
  orderController.verifyPayment,
);
app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/sendEmail', emailRouter);

app.use('*', (req, res, next) => {
  console.log(req.originalUrl);
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find this ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);
module.exports = app;
