const express = require('express');
const authController = require('../controller/authController');
const orderController = require('../controller/orderController');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    orderController.createOrder,
  );

module.exports = router;
