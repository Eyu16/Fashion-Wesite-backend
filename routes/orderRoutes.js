const express = require('express');
const authController = require('../controller/authController');
const orderController = require('../controller/orderController');

const router = express.Router();
router.use(authController.protect);
router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

module.exports = router;
