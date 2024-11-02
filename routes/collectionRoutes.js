const express = require('express');
const collectionContorller = require('../controller/collectionController');

const router = express.Router();

router
  .route('/')
  .get(collectionContorller.getAllCollections)
  .post(collectionContorller.createCollection);

router
  .route('/:collectionId')
  .get(collectionContorller.getCollection)
  .patch(collectionContorller.updateCollection)
  .delete(collectionContorller.deleteCollection);

module.exports = router;
