const express = require('express');
const productController = require('../controller/productController');
const uploadController = require('../controller/uploadController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    uploadController.uploadProductPhoto,
    uploadController.resizeProductImage,
    productController.createProduct,
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    uploadController.uploadProductPhoto,
    uploadController.resizeProductImage,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct,
  );

module.exports = router;
