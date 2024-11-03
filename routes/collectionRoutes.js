const express = require('express');
const collectionContorller = require('../controller/collectionController');
const uploadController = require('../controller/uploadController');

const router = express.Router();

router
  .route('/')
  .get(collectionContorller.getAllCollections)
  .post(
    uploadController.uploadCollectionPhotos,
    uploadController.resizeCollectionPhotos,
    collectionContorller.createCollection,
  );

router
  .route('/:id')
  .get(collectionContorller.getCollection)
  .patch(collectionContorller.updateCollection)
  .delete(collectionContorller.deleteCollection);

module.exports = router;
