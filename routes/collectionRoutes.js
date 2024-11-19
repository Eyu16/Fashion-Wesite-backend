const express = require('express');
const collectionContorller = require('../controller/collectionController');
const uploadController = require('../controller/uploadController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(collectionContorller.getAllCollections)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    uploadController.uploadCollectionPhotos,
    uploadController.resizeCollectionPhotos,
    collectionContorller.createCollection,
  );

router
  .route('/:id')
  .get(collectionContorller.getCollection)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    collectionContorller.updateCollection,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    collectionContorller.deleteCollection,
  );

module.exports = router;
