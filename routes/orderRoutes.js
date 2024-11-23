const express = require('express');
const authController = require('../controller/authController');
const orderController = require('../controller/orderController');

const router = express.Router();
router.use(authController.protect);

router
  .route('/')
  .get(
    authController.restrictTo('admin'),
    orderController.getAllOrders,
  )
  .post(orderController.createOrder);

router
  .route('/myOrders')
  .get(orderController.getCurrentUserOrders);

module.exports = router;
