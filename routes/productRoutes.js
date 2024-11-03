const express = require('express');
const productController = require('../controller/productController');
const uploadController = require('../controller/uploadController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
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
