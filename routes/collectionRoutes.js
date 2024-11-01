const express = require('express');
const collectionContorller = require('../controller/collectionController');

const router = express.Router();

router
  .route('/')
  .get(collectionContorller.getCollections)
  .post(collectionContorller.createCollection);
module.exports = router;
