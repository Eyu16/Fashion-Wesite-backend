const express = require('express');
const productController = require('../controller/productController');
const uploadController = require('../controller/uploadController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(
    // authController.protect,
    productController.getAllProducts,
  )
  .post(
    uploadController.uploadProductPhoto,
    uploadController.resizeProductImage,
    productController.createProduct,
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
